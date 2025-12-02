import { create } from 'zustand'
import type {
  Exercise,
  ExerciseStatus,
  Participant,
  Facilitator,
  ParticipantResponse,
  InjectLog
} from '../types/exercise.types'
import type { Scenario } from '../types/scenario.types'
import { createEmptyExercise, createParticipant, createFacilitator } from '../types/exercise.types'

interface ExerciseStore {
  // Current exercise
  currentExercise: Exercise | null
  linkedScenario: Scenario | null

  // Timer state
  isRunning: boolean
  elapsedTime: number
  moduleElapsedTime: number
  timerInterval: number | null

  // Actions - Exercise lifecycle
  createExercise: (scenario: Scenario, title?: string) => void
  loadExercise: (exercise: Exercise, scenario: Scenario) => void
  startExercise: () => void
  pauseExercise: () => void
  resumeExercise: () => void
  completeExercise: () => void
  resetExercise: () => void

  // Actions - Navigation
  advanceToNextInject: () => void
  advanceToNextModule: () => void
  goToModule: (moduleId: string) => void
  goToInject: (moduleId: string, injectId: string) => void

  // Actions - Participants
  addParticipant: (name: string, role: string) => void
  removeParticipant: (participantId: string) => void
  addFacilitator: (name: string, role: 'lead' | 'co-facilitator' | 'observer') => void
  removeFacilitator: (facilitatorId: string) => void

  // Actions - Responses and logs
  submitResponse: (response: Omit<ParticipantResponse, 'id' | 'createdAt' | 'updatedAt'>) => void
  importResponses: (responses: ParticipantResponse[]) => void
  logInjectDisplay: (injectId: string) => void
  acknowledgeInject: (injectId: string, acknowledgedBy?: string) => void
  addFacilitatorNote: (injectId: string, note: string) => void

  // Actions - Timer (internal)
  _tick: () => void
  _startTimer: () => void
  _stopTimer: () => void
}

export const useExerciseStore = create<ExerciseStore>((set, get) => ({
  currentExercise: null,
  linkedScenario: null,
  isRunning: false,
  elapsedTime: 0,
  moduleElapsedTime: 0,
  timerInterval: null,

  // Exercise lifecycle
  createExercise: (scenario, title) => {
    const exercise = createEmptyExercise(scenario)
    if (title) {
      exercise.title = title
    }

    // Set first module as current if exists
    if (scenario.modules.length > 0) {
      exercise.progress.currentModuleId = scenario.modules[0].id
      exercise.progress.currentModuleIndex = 0

      if (scenario.modules[0].injects.length > 0) {
        exercise.progress.currentInjectId = scenario.modules[0].injects[0].id
        exercise.progress.currentInjectIndex = 0
      }
    }

    set({
      currentExercise: exercise,
      linkedScenario: scenario,
      isRunning: false,
      elapsedTime: 0,
      moduleElapsedTime: 0
    })
  },

  loadExercise: (exercise, scenario) => {
    set({
      currentExercise: exercise,
      linkedScenario: scenario,
      isRunning: false,
      elapsedTime: exercise.totalActiveTime * 60, // Convert minutes to seconds
      moduleElapsedTime: 0
    })
  },

  startExercise: () => {
    const state = get()
    if (!state.currentExercise) return

    const now = new Date().toISOString()
    set({
      currentExercise: {
        ...state.currentExercise,
        status: 'active',
        startedAt: state.currentExercise.startedAt || now,
        progress: {
          ...state.currentExercise.progress,
          moduleStartTime: now
        },
        updatedAt: now
      },
      isRunning: true
    })

    get()._startTimer()
  },

  pauseExercise: () => {
    const state = get()
    if (!state.currentExercise) return

    state._stopTimer()

    set({
      currentExercise: {
        ...state.currentExercise,
        status: 'paused',
        totalActiveTime: Math.floor(state.elapsedTime / 60),
        updatedAt: new Date().toISOString()
      },
      isRunning: false
    })
  },

  resumeExercise: () => {
    const state = get()
    if (!state.currentExercise || state.currentExercise.status !== 'paused') return

    set({
      currentExercise: {
        ...state.currentExercise,
        status: 'active',
        updatedAt: new Date().toISOString()
      },
      isRunning: true
    })

    get()._startTimer()
  },

  completeExercise: () => {
    const state = get()
    if (!state.currentExercise) return

    state._stopTimer()

    set({
      currentExercise: {
        ...state.currentExercise,
        status: 'completed',
        completedAt: new Date().toISOString(),
        totalActiveTime: Math.floor(state.elapsedTime / 60),
        progress: {
          ...state.currentExercise.progress,
          percentComplete: 100
        },
        updatedAt: new Date().toISOString()
      },
      isRunning: false
    })
  },

  resetExercise: () => {
    const state = get()
    state._stopTimer()

    set({
      currentExercise: null,
      linkedScenario: null,
      isRunning: false,
      elapsedTime: 0,
      moduleElapsedTime: 0
    })
  },

  // Navigation
  advanceToNextInject: () => {
    const state = get()
    if (!state.currentExercise || !state.linkedScenario) return

    const { currentModuleId, currentInjectIndex } = state.currentExercise.progress
    const currentModule = state.linkedScenario.modules.find(m => m.id === currentModuleId)

    if (!currentModule) return

    if (currentInjectIndex < currentModule.injects.length - 1) {
      // Move to next inject in current module
      const nextInject = currentModule.injects[currentInjectIndex + 1]
      set({
        currentExercise: {
          ...state.currentExercise,
          progress: {
            ...state.currentExercise.progress,
            currentInjectId: nextInject.id,
            currentInjectIndex: currentInjectIndex + 1,
            completedInjectIds: [
              ...state.currentExercise.progress.completedInjectIds,
              currentModule.injects[currentInjectIndex].id
            ]
          },
          updatedAt: new Date().toISOString()
        }
      })
    }
  },

  advanceToNextModule: () => {
    const state = get()
    if (!state.currentExercise || !state.linkedScenario) return

    const { currentModuleIndex, currentModuleId } = state.currentExercise.progress

    if (currentModuleIndex < state.linkedScenario.modules.length - 1) {
      const nextModule = state.linkedScenario.modules[currentModuleIndex + 1]
      const now = new Date().toISOString()

      set({
        currentExercise: {
          ...state.currentExercise,
          progress: {
            ...state.currentExercise.progress,
            currentModuleId: nextModule.id,
            currentModuleIndex: currentModuleIndex + 1,
            currentInjectId: nextModule.injects[0]?.id || null,
            currentInjectIndex: 0,
            completedModuleIds: [
              ...state.currentExercise.progress.completedModuleIds,
              currentModuleId!
            ],
            moduleStartTime: now
          },
          updatedAt: now
        },
        moduleElapsedTime: 0
      })
    }
  },

  goToModule: (moduleId) => {
    const state = get()
    if (!state.currentExercise || !state.linkedScenario) return

    const moduleIndex = state.linkedScenario.modules.findIndex(m => m.id === moduleId)
    if (moduleIndex === -1) return

    const module = state.linkedScenario.modules[moduleIndex]
    const now = new Date().toISOString()

    set({
      currentExercise: {
        ...state.currentExercise,
        progress: {
          ...state.currentExercise.progress,
          currentModuleId: moduleId,
          currentModuleIndex: moduleIndex,
          currentInjectId: module.injects[0]?.id || null,
          currentInjectIndex: 0,
          moduleStartTime: now
        },
        updatedAt: now
      },
      moduleElapsedTime: 0
    })
  },

  goToInject: (moduleId, injectId) => {
    const state = get()
    if (!state.currentExercise || !state.linkedScenario) return

    const module = state.linkedScenario.modules.find(m => m.id === moduleId)
    if (!module) return

    const injectIndex = module.injects.findIndex(i => i.id === injectId)
    if (injectIndex === -1) return

    set({
      currentExercise: {
        ...state.currentExercise,
        progress: {
          ...state.currentExercise.progress,
          currentModuleId: moduleId,
          currentInjectId: injectId,
          currentInjectIndex: injectIndex
        },
        updatedAt: new Date().toISOString()
      }
    })
  },

  // Participants
  addParticipant: (name, role) => {
    const state = get()
    if (!state.currentExercise) return

    const participant = createParticipant(name, role)
    set({
      currentExercise: {
        ...state.currentExercise,
        participants: [...state.currentExercise.participants, participant],
        updatedAt: new Date().toISOString()
      }
    })
  },

  removeParticipant: (participantId) => {
    const state = get()
    if (!state.currentExercise) return

    set({
      currentExercise: {
        ...state.currentExercise,
        participants: state.currentExercise.participants.filter(p => p.id !== participantId),
        updatedAt: new Date().toISOString()
      }
    })
  },

  addFacilitator: (name, role) => {
    const state = get()
    if (!state.currentExercise) return

    const facilitator = createFacilitator(name, role)
    set({
      currentExercise: {
        ...state.currentExercise,
        facilitators: [...state.currentExercise.facilitators, facilitator],
        updatedAt: new Date().toISOString()
      }
    })
  },

  removeFacilitator: (facilitatorId) => {
    const state = get()
    if (!state.currentExercise) return

    set({
      currentExercise: {
        ...state.currentExercise,
        facilitators: state.currentExercise.facilitators.filter(f => f.id !== facilitatorId),
        updatedAt: new Date().toISOString()
      }
    })
  },

  // Responses and logs
  submitResponse: (response) => {
    const state = get()
    if (!state.currentExercise) return

    const now = new Date().toISOString()
    const fullResponse: ParticipantResponse = {
      ...response,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    }

    set({
      currentExercise: {
        ...state.currentExercise,
        responses: [...state.currentExercise.responses, fullResponse],
        progress: {
          ...state.currentExercise.progress,
          completedQuestionIds: [
            ...state.currentExercise.progress.completedQuestionIds,
            response.questionId
          ]
        },
        updatedAt: now
      }
    })
  },

  importResponses: (responses) => {
    const state = get()
    if (!state.currentExercise) return

    set({
      currentExercise: {
        ...state.currentExercise,
        responses: [...state.currentExercise.responses, ...responses],
        updatedAt: new Date().toISOString()
      }
    })
  },

  logInjectDisplay: (injectId) => {
    const state = get()
    if (!state.currentExercise) return

    const log: InjectLog = {
      injectId,
      displayedAt: new Date().toISOString()
    }

    set({
      currentExercise: {
        ...state.currentExercise,
        injectLogs: [...state.currentExercise.injectLogs, log],
        updatedAt: new Date().toISOString()
      }
    })
  },

  acknowledgeInject: (injectId, acknowledgedBy) => {
    const state = get()
    if (!state.currentExercise) return

    set({
      currentExercise: {
        ...state.currentExercise,
        injectLogs: state.currentExercise.injectLogs.map(log =>
          log.injectId === injectId && !log.acknowledgedAt
            ? { ...log, acknowledgedAt: new Date().toISOString(), acknowledgedBy }
            : log
        ),
        updatedAt: new Date().toISOString()
      }
    })
  },

  addFacilitatorNote: (injectId, note) => {
    const state = get()
    if (!state.currentExercise) return

    set({
      currentExercise: {
        ...state.currentExercise,
        injectLogs: state.currentExercise.injectLogs.map(log =>
          log.injectId === injectId
            ? { ...log, notes: note }
            : log
        ),
        updatedAt: new Date().toISOString()
      }
    })
  },

  // Timer internals
  _tick: () => {
    set(state => ({
      elapsedTime: state.elapsedTime + 1,
      moduleElapsedTime: state.moduleElapsedTime + 1
    }))
  },

  _startTimer: () => {
    const interval = window.setInterval(() => {
      get()._tick()
    }, 1000)

    set({ timerInterval: interval })
  },

  _stopTimer: () => {
    const state = get()
    if (state.timerInterval) {
      clearInterval(state.timerInterval)
      set({ timerInterval: null })
    }
  }
}))
