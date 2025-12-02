import type { Scenario, Identifiable, ScenarioSettings } from './scenario.types'

// ============================================
// EXERCISE SESSION
// ============================================

export type ExerciseStatus =
  | 'draft'
  | 'active'
  | 'paused'
  | 'completed'
  | 'archived'

export interface Exercise extends Identifiable {
  // Reference
  scenarioId: string
  scenarioTitle: string
  scenarioVersion: string

  // Session info
  title: string
  scheduledDate?: string
  status: ExerciseStatus

  // Participants
  participants: Participant[]
  facilitators: Facilitator[]

  // Progress tracking
  progress: ExerciseProgress

  // Timing
  startedAt?: string
  completedAt?: string
  totalActiveTime: number

  // Collected data
  injectLogs: InjectLog[]
  responses: ParticipantResponse[]

  // Settings overrides
  settingsOverrides?: Partial<ScenarioSettings>
}

export interface ExerciseProgress {
  currentModuleId: string | null
  currentModuleIndex: number
  currentInjectId: string | null
  currentInjectIndex: number

  completedModuleIds: string[]
  completedInjectIds: string[]
  completedQuestionIds: string[]

  moduleStartTime?: string
  percentComplete: number
}

// ============================================
// PARTICIPANTS
// ============================================

export interface Participant extends Identifiable {
  name: string
  email?: string
  role: string
  organization?: string

  // Tracking
  joinedAt: string
  lastActiveAt: string
  responseCount: number
}

export interface Facilitator extends Identifiable {
  name: string
  email?: string
  role: 'lead' | 'co-facilitator' | 'observer'
}

// ============================================
// LOGS AND RESPONSES
// ============================================

export interface InjectLog {
  injectId: string
  displayedAt: string
  acknowledgedAt?: string
  acknowledgedBy?: string
  notes?: string
}

export interface ParticipantResponse extends Identifiable {
  exerciseId: string
  participantId: string
  questionId: string
  moduleId: string

  // Response content
  responseType: 'text' | 'multiple_choice' | 'rating' | 'matrix'
  textResponse?: string
  selectedOptions?: string[]
  ratingValue?: number
  matrixResponses?: Record<string, string>

  // Metadata
  submittedAt: string
  editedAt?: string
  isAnonymous: boolean

  // Facilitator annotations
  facilitatorNotes?: string
  highlighted?: boolean
  themes?: string[]
}

// ============================================
// ASYNC COLLABORATION PACKAGES
// ============================================

export interface ExercisePackage {
  version: string
  exportedAt: string
  exportedBy: string

  // Content
  scenario: Scenario
  exercise?: Exercise

  // For participant distribution
  participantMode?: boolean

  // Checksums for integrity
  checksum: string
}

export interface ResponsePackage {
  version: string
  exerciseId: string
  participantId: string
  participantName: string

  responses: ParticipantResponse[]
  submittedAt: string

  checksum: string
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function createEmptyExercise(scenario: Scenario): Exercise {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    scenarioId: scenario.id,
    scenarioTitle: scenario.title,
    scenarioVersion: scenario.version,
    title: `${scenario.title} - Exercise`,
    status: 'draft',
    participants: [],
    facilitators: [],
    progress: {
      currentModuleId: null,
      currentModuleIndex: 0,
      currentInjectId: null,
      currentInjectIndex: 0,
      completedModuleIds: [],
      completedInjectIds: [],
      completedQuestionIds: [],
      percentComplete: 0
    },
    totalActiveTime: 0,
    injectLogs: [],
    responses: []
  }
}

export function createParticipant(name: string, role: string): Participant {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    name,
    role,
    joinedAt: now,
    lastActiveAt: now,
    responseCount: 0
  }
}

export function createFacilitator(name: string, role: 'lead' | 'co-facilitator' | 'observer' = 'lead'): Facilitator {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    name,
    role
  }
}
