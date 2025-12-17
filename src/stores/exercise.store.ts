import { create } from 'zustand'
import type {
  Exercise,
  ExerciseStatus,
  Participant,
  Facilitator,
  ParticipantResponse,
  InjectLog,
  BranchDecision,
  FacilitatorNote,
  NoteCategory,
  DiscussionState,
  DiscussionStatus,
  ExerciseChecklist,
  TimingStatus
} from '../types/exercise.types'
import type { Scenario, BranchOption, Inject, InsertedInject } from '../types/scenario.types'
import {
  createEmptyExercise,
  createParticipant,
  createFacilitator,
  createFacilitatorNote,
  createDefaultChecklist,
  createDiscussionState
} from '../types/exercise.types'

interface ExerciseStore {
  // Current exercise
  currentExercise: Exercise | null
  linkedScenario: Scenario | null

  // Timer state
  isRunning: boolean
  elapsedTime: number
  moduleElapsedTime: number
  timerInterval: number | null

  // Branching state
  pendingBranchOptions: BranchOption[] | null
  branchSelectionMode: 'none' | 'awaiting' | 'selected'

  // Facilitation state
  facilitatorNotes: FacilitatorNote[]
  discussionStates: Record<string, DiscussionState>
  checklist: ExerciseChecklist
  activeDiscussionId: string | null

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

  // Actions - Branching
  selectBranch: (branchOptionId: string, decidedBy?: string) => void
  evaluateBranchConditions: (inject: Inject) => BranchOption[]
  skipBranchDecision: () => void
  clearPendingBranch: () => void
  revertToBeforeBranch: (branchDecisionIndex: number) => void

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
  addInjectNote: (injectId: string, note: string) => void

  // Actions - Facilitator Notes
  addNote: (content: string, category: NoteCategory) => void
  updateNote: (noteId: string, content: string) => void
  deleteNote: (noteId: string) => void

  // Actions - Discussion Tracking
  startDiscussion: (questionId: string) => void
  concludeDiscussion: (questionId: string) => void
  addKeyTheme: (questionId: string, theme: string) => void
  removeKeyTheme: (questionId: string, theme: string) => void
  highlightResponse: (questionId: string, responseId: string) => void
  unhighlightResponse: (questionId: string, responseId: string) => void

  // Actions - Checklist
  toggleChecklistItem: (phase: 'preExercise' | 'postExercise', itemId: string) => void
  resetChecklist: () => void

  // Actions - Timing helpers
  getTimingStatus: () => TimingStatus
  getModuleSuggestedDuration: () => number | null

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

  // Branching state
  pendingBranchOptions: null,
  branchSelectionMode: 'none',

  // Facilitation state
  facilitatorNotes: [],
  discussionStates: {},
  checklist: createDefaultChecklist(),
  activeDiscussionId: null,

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
      moduleElapsedTime: 0,
      pendingBranchOptions: null,
      branchSelectionMode: 'none',
      // Reset facilitation state
      facilitatorNotes: [],
      discussionStates: {},
      checklist: createDefaultChecklist(),
      activeDiscussionId: null
    })
  },

  // Navigation
  advanceToNextInject: () => {
    const state = get()
    if (!state.currentExercise || !state.linkedScenario) return

    const { currentModuleId, currentInjectIndex, insertedInjectQueue } = state.currentExercise.progress
    const currentModule = state.linkedScenario.modules.find(m => m.id === currentModuleId)

    if (!currentModule) return

    // Check if there are dynamically inserted injects to show first
    if (insertedInjectQueue && insertedInjectQueue.length > 0) {
      // Remove the first inserted inject from queue (it's being shown)
      const remainingQueue = insertedInjectQueue.slice(1)
      set({
        currentExercise: {
          ...state.currentExercise,
          progress: {
            ...state.currentExercise.progress,
            insertedInjectQueue: remainingQueue
          },
          updatedAt: new Date().toISOString()
        }
      })
      return
    }

    const currentInject = currentModule.injects[currentInjectIndex]

    // Check if current inject has branches
    if (currentInject?.branches && currentInject.branches.length > 0) {
      const availableBranches = get().evaluateBranchConditions(currentInject)

      if (availableBranches.length > 0) {
        // Present branch options to facilitator
        set({
          pendingBranchOptions: availableBranches,
          branchSelectionMode: 'awaiting',
          currentExercise: {
            ...state.currentExercise,
            progress: {
              ...state.currentExercise.progress,
              pendingBranchDecision: currentInject.id
            },
            updatedAt: new Date().toISOString()
          }
        })
        return
      }
    }

    // Normal linear advancement
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

    const moduleIndex = state.linkedScenario.modules.findIndex(m => m.id === moduleId)

    set({
      currentExercise: {
        ...state.currentExercise,
        progress: {
          ...state.currentExercise.progress,
          currentModuleId: moduleId,
          currentModuleIndex: moduleIndex !== -1 ? moduleIndex : state.currentExercise.progress.currentModuleIndex,
          currentInjectId: injectId,
          currentInjectIndex: injectIndex
        },
        updatedAt: new Date().toISOString()
      }
    })
  },

  // Branching
  selectBranch: (branchOptionId, decidedBy = 'facilitator') => {
    const state = get()
    if (!state.currentExercise || !state.linkedScenario || !state.pendingBranchOptions) return

    const selectedBranch = state.pendingBranchOptions.find(b => b.id === branchOptionId)
    if (!selectedBranch) return

    const currentInjectId = state.currentExercise.progress.currentInjectId
    const now = new Date().toISOString()

    // Record the decision
    const branchDecision: BranchDecision = {
      injectId: currentInjectId!,
      branchOptionId,
      decidedAt: now,
      decidedBy,
      previousInjectId: currentInjectId!
    }

    // Handle different target types
    const { target } = selectedBranch

    switch (target.type) {
      case 'inject': {
        // Navigate to specific inject
        const targetModuleId = target.moduleId || state.currentExercise.progress.currentModuleId
        if (targetModuleId && target.injectId) {
          // Update branch tracking state
          set({
            pendingBranchOptions: null,
            branchSelectionMode: 'none',
            currentExercise: {
              ...state.currentExercise,
              progress: {
                ...state.currentExercise.progress,
                branchHistory: [...state.currentExercise.progress.branchHistory, branchDecision],
                currentBranchPath: [...state.currentExercise.progress.currentBranchPath, branchOptionId],
                pendingBranchDecision: undefined,
                completedInjectIds: [
                  ...state.currentExercise.progress.completedInjectIds,
                  currentInjectId!
                ]
              },
              updatedAt: now
            }
          })
          // Then navigate
          get().goToInject(targetModuleId, target.injectId)
        }
        break
      }

      case 'module': {
        // Jump to module start
        if (target.targetModuleId) {
          set({
            pendingBranchOptions: null,
            branchSelectionMode: 'none',
            currentExercise: {
              ...state.currentExercise,
              progress: {
                ...state.currentExercise.progress,
                branchHistory: [...state.currentExercise.progress.branchHistory, branchDecision],
                currentBranchPath: [...state.currentExercise.progress.currentBranchPath, branchOptionId],
                pendingBranchDecision: undefined,
                completedInjectIds: [
                  ...state.currentExercise.progress.completedInjectIds,
                  currentInjectId!
                ]
              },
              updatedAt: now
            }
          })
          get().goToModule(target.targetModuleId)
        }
        break
      }

      case 'end_module': {
        // Skip to next module
        set({
          pendingBranchOptions: null,
          branchSelectionMode: 'none',
          currentExercise: {
            ...state.currentExercise,
            progress: {
              ...state.currentExercise.progress,
              branchHistory: [...state.currentExercise.progress.branchHistory, branchDecision],
              currentBranchPath: [...state.currentExercise.progress.currentBranchPath, branchOptionId],
              pendingBranchDecision: undefined,
              completedInjectIds: [
                ...state.currentExercise.progress.completedInjectIds,
                currentInjectId!
              ]
            },
            updatedAt: now
          }
        })
        get().advanceToNextModule()
        break
      }

      case 'end_scenario': {
        // End the exercise
        set({
          pendingBranchOptions: null,
          branchSelectionMode: 'none',
          currentExercise: {
            ...state.currentExercise,
            progress: {
              ...state.currentExercise.progress,
              branchHistory: [...state.currentExercise.progress.branchHistory, branchDecision],
              currentBranchPath: [...state.currentExercise.progress.currentBranchPath, branchOptionId],
              pendingBranchDecision: undefined
            },
            updatedAt: now
          }
        })
        get().completeExercise()
        break
      }

      case 'insert_injects': {
        // Queue dynamic injects
        const insertedInjects = target.insertedInjects || []
        set({
          pendingBranchOptions: null,
          branchSelectionMode: 'none',
          currentExercise: {
            ...state.currentExercise,
            progress: {
              ...state.currentExercise.progress,
              branchHistory: [...state.currentExercise.progress.branchHistory, branchDecision],
              currentBranchPath: [...state.currentExercise.progress.currentBranchPath, branchOptionId],
              pendingBranchDecision: undefined,
              insertedInjectQueue: insertedInjects
            },
            updatedAt: now
          }
        })
        break
      }
    }
  },

  evaluateBranchConditions: (inject) => {
    const state = get()
    if (!inject.branches) return []

    // For now, return all branches. More sophisticated condition evaluation can be added later
    // to filter based on time thresholds, response values, etc.
    return inject.branches.filter(branch => {
      if (!branch.conditions || branch.conditions.length === 0) return true

      // Check each condition
      return branch.conditions.every(condition => {
        switch (condition.type) {
          case 'always':
            return true

          case 'time_threshold': {
            if (!condition.timeThresholdMinutes) return true
            const elapsedMinutes = state.elapsedTime / 60
            if (condition.timeOperator === 'greater_than') {
              return elapsedMinutes > condition.timeThresholdMinutes
            }
            if (condition.timeOperator === 'less_than') {
              return elapsedMinutes < condition.timeThresholdMinutes
            }
            return true
          }

          case 'inject_acknowledged': {
            if (!condition.targetInjectId || !state.currentExercise) return true
            return state.currentExercise.injectLogs.some(
              log => log.injectId === condition.targetInjectId && log.acknowledgedAt
            )
          }

          case 'response_value': {
            // This would check participant responses - simplified for now
            return true
          }

          default:
            return true
        }
      })
    })
  },

  skipBranchDecision: () => {
    const state = get()
    if (!state.currentExercise || !state.pendingBranchOptions) return

    // Find default branch or first branch
    const defaultBranch = state.pendingBranchOptions.find(b => b.isDefault)

    if (defaultBranch) {
      get().selectBranch(defaultBranch.id, 'facilitator_skip')
    } else {
      // Just clear the branch state and continue linearly
      get().clearPendingBranch()
    }
  },

  clearPendingBranch: () => {
    const state = get()
    if (!state.currentExercise) return

    set({
      pendingBranchOptions: null,
      branchSelectionMode: 'none',
      currentExercise: {
        ...state.currentExercise,
        progress: {
          ...state.currentExercise.progress,
          pendingBranchDecision: undefined
        },
        updatedAt: new Date().toISOString()
      }
    })
  },

  revertToBeforeBranch: (branchDecisionIndex) => {
    const state = get()
    if (!state.currentExercise || !state.linkedScenario) return

    const branchHistory = state.currentExercise.progress.branchHistory
    if (branchDecisionIndex < 0 || branchDecisionIndex >= branchHistory.length) return

    const targetDecision = branchHistory[branchDecisionIndex]
    const targetInjectId = targetDecision.previousInjectId

    // Find which module contains this inject
    let targetModuleId: string | null = null
    for (const module of state.linkedScenario.modules) {
      if (module.injects.some(i => i.id === targetInjectId)) {
        targetModuleId = module.id
        break
      }
    }

    if (!targetModuleId) return

    // Revert branch history
    const newBranchHistory = branchHistory.slice(0, branchDecisionIndex)
    const newBranchPath = state.currentExercise.progress.currentBranchPath.slice(0, branchDecisionIndex)

    set({
      currentExercise: {
        ...state.currentExercise,
        progress: {
          ...state.currentExercise.progress,
          branchHistory: newBranchHistory,
          currentBranchPath: newBranchPath
        },
        updatedAt: new Date().toISOString()
      }
    })

    get().goToInject(targetModuleId, targetInjectId)
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

  addInjectNote: (injectId, note) => {
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

  // Facilitator Notes
  addNote: (content, category) => {
    const state = get()
    if (!state.currentExercise) return

    const moduleId = state.currentExercise.progress.currentModuleId || ''
    const injectId = state.currentExercise.progress.currentInjectId || undefined

    const note = createFacilitatorNote(content, category, moduleId, state.elapsedTime, injectId)

    set({
      facilitatorNotes: [...state.facilitatorNotes, note]
    })
  },

  updateNote: (noteId, content) => {
    set(state => ({
      facilitatorNotes: state.facilitatorNotes.map(note =>
        note.id === noteId ? { ...note, content } : note
      )
    }))
  },

  deleteNote: (noteId) => {
    set(state => ({
      facilitatorNotes: state.facilitatorNotes.filter(note => note.id !== noteId)
    }))
  },

  // Discussion Tracking
  startDiscussion: (questionId) => {
    const state = get()
    const existing = state.discussionStates[questionId]
    const now = new Date().toISOString()

    set({
      discussionStates: {
        ...state.discussionStates,
        [questionId]: existing
          ? { ...existing, status: 'in_progress', startedAt: existing.startedAt || now }
          : { ...createDiscussionState(questionId), status: 'in_progress', startedAt: now }
      },
      activeDiscussionId: questionId
    })
  },

  concludeDiscussion: (questionId) => {
    const state = get()
    const existing = state.discussionStates[questionId]
    if (!existing) return

    const now = new Date().toISOString()
    const startTime = existing.startedAt ? new Date(existing.startedAt).getTime() : Date.now()
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)

    set({
      discussionStates: {
        ...state.discussionStates,
        [questionId]: {
          ...existing,
          status: 'concluded',
          concludedAt: now,
          timeSpent: existing.timeSpent + timeSpent
        }
      },
      activeDiscussionId: state.activeDiscussionId === questionId ? null : state.activeDiscussionId
    })
  },

  addKeyTheme: (questionId, theme) => {
    const state = get()
    const existing = state.discussionStates[questionId] || createDiscussionState(questionId)

    if (existing.keyThemes.includes(theme)) return

    set({
      discussionStates: {
        ...state.discussionStates,
        [questionId]: {
          ...existing,
          keyThemes: [...existing.keyThemes, theme]
        }
      }
    })
  },

  removeKeyTheme: (questionId, theme) => {
    const state = get()
    const existing = state.discussionStates[questionId]
    if (!existing) return

    set({
      discussionStates: {
        ...state.discussionStates,
        [questionId]: {
          ...existing,
          keyThemes: existing.keyThemes.filter(t => t !== theme)
        }
      }
    })
  },

  highlightResponse: (questionId, responseId) => {
    const state = get()
    const existing = state.discussionStates[questionId] || createDiscussionState(questionId)

    if (existing.highlightedResponseIds.includes(responseId)) return

    set({
      discussionStates: {
        ...state.discussionStates,
        [questionId]: {
          ...existing,
          highlightedResponseIds: [...existing.highlightedResponseIds, responseId]
        }
      }
    })
  },

  unhighlightResponse: (questionId, responseId) => {
    const state = get()
    const existing = state.discussionStates[questionId]
    if (!existing) return

    set({
      discussionStates: {
        ...state.discussionStates,
        [questionId]: {
          ...existing,
          highlightedResponseIds: existing.highlightedResponseIds.filter(id => id !== responseId)
        }
      }
    })
  },

  // Checklist
  toggleChecklistItem: (phase, itemId) => {
    const state = get()
    const now = new Date().toISOString()

    set({
      checklist: {
        ...state.checklist,
        [phase]: state.checklist[phase].map(item =>
          item.id === itemId
            ? { ...item, completed: !item.completed, completedAt: !item.completed ? now : undefined }
            : item
        )
      }
    })
  },

  resetChecklist: () => {
    set({ checklist: createDefaultChecklist() })
  },

  // Timing helpers
  getTimingStatus: () => {
    const state = get()
    const suggestedDuration = state.getModuleSuggestedDuration()

    if (!suggestedDuration) return 'on_track'

    const suggestedSeconds = suggestedDuration * 60
    const percentElapsed = (state.moduleElapsedTime / suggestedSeconds) * 100

    if (percentElapsed >= 100) return 'overtime'
    if (percentElapsed >= 80) return 'warning'
    return 'on_track'
  },

  getModuleSuggestedDuration: () => {
    const state = get()
    if (!state.linkedScenario || !state.currentExercise) return null

    const currentModule = state.linkedScenario.modules.find(
      m => m.id === state.currentExercise?.progress.currentModuleId
    )

    return currentModule?.duration || currentModule?.suggestedDuration || null
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
