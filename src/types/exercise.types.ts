import type { Scenario, Identifiable, ScenarioSettings, InsertedInject } from './scenario.types'

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

  // Branch tracking
  branchHistory: BranchDecision[]         // Record of all branch decisions made
  currentBranchPath: string[]             // IDs of branch options taken to reach current state
  insertedInjectQueue: InsertedInject[]   // Dynamically inserted injects to show
  pendingBranchDecision?: string          // ID of inject waiting for branch selection
}

/**
 * Records a branch decision made during exercise
 */
export interface BranchDecision {
  injectId: string                 // The inject where decision was made
  branchOptionId: string           // Which option was chosen
  decidedAt: string                // Timestamp
  decidedBy: string                // Facilitator ID or 'participant_vote' or 'automatic'
  previousInjectId: string         // Inject ID before this decision (for backtracking)
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
// FACILITATOR TOOLS
// ============================================

export type NoteCategory = 'observation' | 'action_item' | 'follow_up' | 'general'

export interface FacilitatorNote {
  id: string
  timestamp: number // elapsed time in seconds when created
  moduleId: string
  injectId?: string
  category: NoteCategory
  content: string
  createdAt: string
}

export type DiscussionStatus = 'not_started' | 'in_progress' | 'concluded'

export interface DiscussionState {
  questionId: string
  status: DiscussionStatus
  startedAt?: string
  concludedAt?: string
  keyThemes: string[]
  highlightedResponseIds: string[]
  timeSpent: number // seconds spent on this discussion
}

export interface ChecklistItem {
  id: string
  label: string
  completed: boolean
  completedAt?: string
}

export interface ExerciseChecklist {
  preExercise: ChecklistItem[]
  postExercise: ChecklistItem[]
}

export type TimingStatus = 'on_track' | 'warning' | 'overtime'

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
      percentComplete: 0,
      // Branch tracking
      branchHistory: [],
      currentBranchPath: [],
      insertedInjectQueue: []
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

export function createFacilitatorNote(
  content: string,
  category: NoteCategory,
  moduleId: string,
  timestamp: number,
  injectId?: string
): FacilitatorNote {
  return {
    id: crypto.randomUUID(),
    timestamp,
    moduleId,
    injectId,
    category,
    content,
    createdAt: new Date().toISOString()
  }
}

export function createDefaultChecklist(): ExerciseChecklist {
  return {
    preExercise: [
      { id: 'pre-1', label: 'Scenario loaded and reviewed', completed: false },
      { id: 'pre-2', label: 'Participants identified', completed: false },
      { id: 'pre-3', label: 'Materials distributed (if needed)', completed: false },
      { id: 'pre-4', label: 'Audio/Video setup confirmed', completed: false },
      { id: 'pre-5', label: 'Ground rules communicated', completed: false }
    ],
    postExercise: [
      { id: 'post-1', label: 'AAR/Hotwash conducted', completed: false },
      { id: 'post-2', label: 'Participant feedback collected', completed: false },
      { id: 'post-3', label: 'Notes exported', completed: false },
      { id: 'post-4', label: 'Follow-up actions documented', completed: false },
      { id: 'post-5', label: 'Report generated', completed: false }
    ]
  }
}

export function createDiscussionState(questionId: string): DiscussionState {
  return {
    questionId,
    status: 'not_started',
    keyThemes: [],
    highlightedResponseIds: [],
    timeSpent: 0
  }
}
