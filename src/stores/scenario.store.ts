import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Scenario,
  Module,
  Inject,
  DiscussionQuestion,
  SupportingMaterial
} from '../types/scenario.types'
import {
  createEmptyScenario,
  createEmptyModule,
  createEmptyInject,
  createEmptyQuestion
} from '../types/scenario.types'

interface ScenarioStore {
  // Current scenario being edited
  currentScenario: Scenario | null
  isDirty: boolean
  filePath: string | null

  // Undo/redo history
  history: Scenario[]
  historyIndex: number
  maxHistory: number

  // Actions - Scenario
  createNewScenario: () => void
  loadScenario: (scenario: Scenario, filePath?: string) => void
  updateScenario: (updates: Partial<Scenario>) => void
  markSaved: (filePath?: string) => void
  reset: () => void

  // Actions - Modules
  addModule: () => void
  updateModule: (moduleId: string, updates: Partial<Module>) => void
  removeModule: (moduleId: string) => void
  reorderModules: (moduleIds: string[]) => void

  // Actions - Injects
  addInject: (moduleId: string) => void
  updateInject: (moduleId: string, injectId: string, updates: Partial<Inject>) => void
  removeInject: (moduleId: string, injectId: string) => void
  reorderInjects: (moduleId: string, injectIds: string[]) => void

  // Actions - Questions
  addQuestion: (moduleId: string) => void
  updateQuestion: (moduleId: string, questionId: string, updates: Partial<DiscussionQuestion>) => void
  removeQuestion: (moduleId: string, questionId: string) => void

  // Actions - History
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

const pushHistory = (state: ScenarioStore, scenario: Scenario): Partial<ScenarioStore> => {
  const newHistory = state.history.slice(0, state.historyIndex + 1)
  newHistory.push(JSON.parse(JSON.stringify(scenario)))

  // Limit history size
  if (newHistory.length > state.maxHistory) {
    newHistory.shift()
  }

  return {
    history: newHistory,
    historyIndex: newHistory.length - 1
  }
}

export const useScenarioStore = create<ScenarioStore>()(
  persist(
    (set, get) => ({
      currentScenario: null,
      isDirty: false,
      filePath: null,
      history: [],
      historyIndex: -1,
      maxHistory: 50,

      // Scenario actions
      createNewScenario: () => {
        const newScenario = createEmptyScenario()
        set({
          currentScenario: newScenario,
          isDirty: false,
          filePath: null,
          history: [JSON.parse(JSON.stringify(newScenario))],
          historyIndex: 0
        })
      },

      loadScenario: (scenario, filePath) => {
        set({
          currentScenario: scenario,
          isDirty: false,
          filePath: filePath || null,
          history: [JSON.parse(JSON.stringify(scenario))],
          historyIndex: 0
        })
      },

      updateScenario: (updates) => {
        const state = get()
        if (!state.currentScenario) return

        const updatedScenario = {
          ...state.currentScenario,
          ...updates,
          updatedAt: new Date().toISOString()
        }

        set({
          currentScenario: updatedScenario,
          isDirty: true,
          ...pushHistory(state, updatedScenario)
        })
      },

      markSaved: (filePath) => {
        set({
          isDirty: false,
          filePath: filePath || get().filePath
        })
      },

      reset: () => {
        set({
          currentScenario: null,
          isDirty: false,
          filePath: null,
          history: [],
          historyIndex: -1
        })
      },

      // Module actions
      addModule: () => {
        const state = get()
        if (!state.currentScenario) return

        const newModule = createEmptyModule(state.currentScenario.modules.length)
        const updatedScenario = {
          ...state.currentScenario,
          modules: [...state.currentScenario.modules, newModule],
          updatedAt: new Date().toISOString()
        }

        set({
          currentScenario: updatedScenario,
          isDirty: true,
          ...pushHistory(state, updatedScenario)
        })
      },

      updateModule: (moduleId, updates) => {
        const state = get()
        if (!state.currentScenario) return

        const updatedScenario = {
          ...state.currentScenario,
          modules: state.currentScenario.modules.map(m =>
            m.id === moduleId
              ? { ...m, ...updates, updatedAt: new Date().toISOString() }
              : m
          ),
          updatedAt: new Date().toISOString()
        }

        set({
          currentScenario: updatedScenario,
          isDirty: true,
          ...pushHistory(state, updatedScenario)
        })
      },

      removeModule: (moduleId) => {
        const state = get()
        if (!state.currentScenario) return

        const updatedScenario = {
          ...state.currentScenario,
          modules: state.currentScenario.modules
            .filter(m => m.id !== moduleId)
            .map((m, i) => ({ ...m, order: i })),
          updatedAt: new Date().toISOString()
        }

        set({
          currentScenario: updatedScenario,
          isDirty: true,
          ...pushHistory(state, updatedScenario)
        })
      },

      reorderModules: (moduleIds) => {
        const state = get()
        if (!state.currentScenario) return

        const moduleMap = new Map(state.currentScenario.modules.map(m => [m.id, m]))
        const reorderedModules = moduleIds
          .map((id, index) => {
            const module = moduleMap.get(id)
            return module ? { ...module, order: index } : null
          })
          .filter((m): m is Module => m !== null)

        const updatedScenario = {
          ...state.currentScenario,
          modules: reorderedModules,
          updatedAt: new Date().toISOString()
        }

        set({
          currentScenario: updatedScenario,
          isDirty: true,
          ...pushHistory(state, updatedScenario)
        })
      },

      // Inject actions
      addInject: (moduleId) => {
        const state = get()
        if (!state.currentScenario) return

        const module = state.currentScenario.modules.find(m => m.id === moduleId)
        if (!module) return

        const newInject = createEmptyInject(module.injects.length)
        const updatedScenario = {
          ...state.currentScenario,
          modules: state.currentScenario.modules.map(m =>
            m.id === moduleId
              ? { ...m, injects: [...m.injects, newInject], updatedAt: new Date().toISOString() }
              : m
          ),
          updatedAt: new Date().toISOString()
        }

        set({
          currentScenario: updatedScenario,
          isDirty: true,
          ...pushHistory(state, updatedScenario)
        })
      },

      updateInject: (moduleId, injectId, updates) => {
        const state = get()
        if (!state.currentScenario) return

        const updatedScenario = {
          ...state.currentScenario,
          modules: state.currentScenario.modules.map(m =>
            m.id === moduleId
              ? {
                  ...m,
                  injects: m.injects.map(i =>
                    i.id === injectId
                      ? { ...i, ...updates, updatedAt: new Date().toISOString() }
                      : i
                  ),
                  updatedAt: new Date().toISOString()
                }
              : m
          ),
          updatedAt: new Date().toISOString()
        }

        set({
          currentScenario: updatedScenario,
          isDirty: true,
          ...pushHistory(state, updatedScenario)
        })
      },

      removeInject: (moduleId, injectId) => {
        const state = get()
        if (!state.currentScenario) return

        const updatedScenario = {
          ...state.currentScenario,
          modules: state.currentScenario.modules.map(m =>
            m.id === moduleId
              ? {
                  ...m,
                  injects: m.injects
                    .filter(i => i.id !== injectId)
                    .map((i, idx) => ({ ...i, order: idx })),
                  updatedAt: new Date().toISOString()
                }
              : m
          ),
          updatedAt: new Date().toISOString()
        }

        set({
          currentScenario: updatedScenario,
          isDirty: true,
          ...pushHistory(state, updatedScenario)
        })
      },

      reorderInjects: (moduleId, injectIds) => {
        const state = get()
        if (!state.currentScenario) return

        const updatedScenario = {
          ...state.currentScenario,
          modules: state.currentScenario.modules.map(m => {
            if (m.id !== moduleId) return m

            const injectMap = new Map(m.injects.map(i => [i.id, i]))
            const reorderedInjects = injectIds
              .map((id, index) => {
                const inject = injectMap.get(id)
                return inject ? { ...inject, order: index } : null
              })
              .filter((i): i is Inject => i !== null)

            return { ...m, injects: reorderedInjects, updatedAt: new Date().toISOString() }
          }),
          updatedAt: new Date().toISOString()
        }

        set({
          currentScenario: updatedScenario,
          isDirty: true,
          ...pushHistory(state, updatedScenario)
        })
      },

      // Question actions
      addQuestion: (moduleId) => {
        const state = get()
        if (!state.currentScenario) return

        const module = state.currentScenario.modules.find(m => m.id === moduleId)
        if (!module) return

        const newQuestion = createEmptyQuestion(module.discussionQuestions.length)
        const updatedScenario = {
          ...state.currentScenario,
          modules: state.currentScenario.modules.map(m =>
            m.id === moduleId
              ? {
                  ...m,
                  discussionQuestions: [...m.discussionQuestions, newQuestion],
                  updatedAt: new Date().toISOString()
                }
              : m
          ),
          updatedAt: new Date().toISOString()
        }

        set({
          currentScenario: updatedScenario,
          isDirty: true,
          ...pushHistory(state, updatedScenario)
        })
      },

      updateQuestion: (moduleId, questionId, updates) => {
        const state = get()
        if (!state.currentScenario) return

        const updatedScenario = {
          ...state.currentScenario,
          modules: state.currentScenario.modules.map(m =>
            m.id === moduleId
              ? {
                  ...m,
                  discussionQuestions: m.discussionQuestions.map(q =>
                    q.id === questionId
                      ? { ...q, ...updates, updatedAt: new Date().toISOString() }
                      : q
                  ),
                  updatedAt: new Date().toISOString()
                }
              : m
          ),
          updatedAt: new Date().toISOString()
        }

        set({
          currentScenario: updatedScenario,
          isDirty: true,
          ...pushHistory(state, updatedScenario)
        })
      },

      removeQuestion: (moduleId, questionId) => {
        const state = get()
        if (!state.currentScenario) return

        const updatedScenario = {
          ...state.currentScenario,
          modules: state.currentScenario.modules.map(m =>
            m.id === moduleId
              ? {
                  ...m,
                  discussionQuestions: m.discussionQuestions
                    .filter(q => q.id !== questionId)
                    .map((q, idx) => ({ ...q, order: idx })),
                  updatedAt: new Date().toISOString()
                }
              : m
          ),
          updatedAt: new Date().toISOString()
        }

        set({
          currentScenario: updatedScenario,
          isDirty: true,
          ...pushHistory(state, updatedScenario)
        })
      },

      // History actions
      undo: () => {
        const state = get()
        if (state.historyIndex <= 0) return

        const newIndex = state.historyIndex - 1
        const previousScenario = state.history[newIndex]

        set({
          currentScenario: JSON.parse(JSON.stringify(previousScenario)),
          historyIndex: newIndex,
          isDirty: true
        })
      },

      redo: () => {
        const state = get()
        if (state.historyIndex >= state.history.length - 1) return

        const newIndex = state.historyIndex + 1
        const nextScenario = state.history[newIndex]

        set({
          currentScenario: JSON.parse(JSON.stringify(nextScenario)),
          historyIndex: newIndex,
          isDirty: true
        })
      },

      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1
    }),
    {
      name: 'ctep-scenario-store',
      partialize: (state) => ({
        // Only persist essential state, not history
        currentScenario: state.currentScenario,
        filePath: state.filePath
      }),
      onRehydrate: () => (state) => {
        // After rehydration, initialize history with current scenario if present
        if (state && state.currentScenario) {
          state.history = [JSON.parse(JSON.stringify(state.currentScenario))]
          state.historyIndex = 0
        }
      }
    }
  )
)
