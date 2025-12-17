// ============================================
// BASE TYPES
// ============================================

export interface Identifiable {
  id: string
  createdAt: string
  updatedAt: string
}

export interface Orderable {
  order: number
}

export type ThreatCategory =
  | 'ransomware'
  | 'phishing'
  | 'insider_threat'
  | 'ics_compromise'
  | 'data_breach'
  | 'supply_chain'
  | 'ddos'
  | 'apt'
  | 'social_engineering'
  | 'custom'

export type ModulePhase =
  | 'pre_incident'
  | 'detection'
  | 'containment'
  | 'eradication'
  | 'recovery'
  | 'post_incident'

export type InjectType =
  | 'information'
  | 'decision_point'
  | 'escalation'
  | 'communication'
  | 'resource'
  | 'media'
  | 'regulatory'
  | 'technical'

export type Severity = 'low' | 'medium' | 'high' | 'critical'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type QuestionCategory =
  | 'decision'
  | 'coordination'
  | 'communication'
  | 'technical'
  | 'policy'
  | 'resource'
  | 'lessons_learned'

export type ResponseType = 'text' | 'multiple_choice' | 'rating' | 'matrix'

// ============================================
// SCENARIO
// ============================================

export interface Scenario extends Identifiable {
  // Metadata
  title: string
  subtitle?: string
  description: string
  version: string
  author: string
  organization?: string

  // Classification
  threatCategory: ThreatCategory
  customThreatType?: string
  tags: string[]

  // Difficulty and timing
  difficulty: Difficulty
  estimatedDuration: number
  targetAudience: string[]

  // Structure
  objectives: string[]
  modules: Module[]

  // Supporting materials
  facilitatorGuide?: SupportingMaterial
  participantHandout?: SupportingMaterial
  aarTemplate?: SupportingMaterial
  additionalMaterials: SupportingMaterial[]

  // Settings
  settings: ScenarioSettings

  // Branching configuration
  branchingSettings?: BranchingSettings
  injectLibrary?: Inject[]         // Reusable injects for dynamic insertion
}

export interface ScenarioSettings {
  allowParticipantSkip: boolean
  requireAllResponses: boolean
  showInjectTimestamps: boolean
  enableAnonymousResponses: boolean
  customBranding?: {
    logo?: string
    primaryColor?: string
    organizationName?: string
  }
}

// ============================================
// MODULE
// ============================================

export interface Module extends Identifiable, Orderable {
  title: string
  phase: ModulePhase
  description: string

  // Timing
  suggestedDuration: number

  // Content
  injects: Inject[]
  discussionQuestions: DiscussionQuestion[]

  // Facilitation
  facilitatorNotes?: string
  transitionGuidance?: string

  // Optional custom phase name
  customPhaseName?: string
}

// ============================================
// INJECT
// ============================================

export interface Inject extends Identifiable, Orderable {
  // Core content
  title: string
  content: string

  // Classification
  type: InjectType
  severity: Severity

  // Timing
  triggerTime: number
  displayDuration?: number

  // Additional context
  source?: string
  attachments: Attachment[]

  // Expected responses/actions (facilitator only)
  expectedActions?: string[]
  facilitatorNotes?: string

  // Conditional logic
  conditions?: InjectCondition[]

  // Related discussion questions
  relatedQuestionIds: string[]

  // Branching - makes this inject a decision point
  branches?: BranchOption[]        // If present, this inject is a decision point
  isBranchTarget?: boolean         // Marks inject as a potential branch destination
  branchGroupId?: string           // Groups related branch injects for visualization
}

export interface Attachment {
  id: string
  name: string
  type: 'image' | 'document' | 'log' | 'email' | 'artifact'
  content: string
  mimeType: string
}

export interface InjectCondition {
  type: 'time_elapsed' | 'inject_completed' | 'response_given'
  value: string | number
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains'
}

// ============================================
// DISCUSSION QUESTION
// ============================================

export interface DiscussionQuestion extends Identifiable, Orderable {
  question: string
  category: QuestionCategory

  // Context
  context?: string

  // Facilitation support
  guidanceNotes?: string
  expectedThemes?: string[]
  followUpQuestions?: string[]

  // Response configuration
  responseType: ResponseType
  responseOptions?: ResponseOption[]

  // Timing
  suggestedDiscussionTime?: number

  // Dependencies
  requiredInjectIds?: string[]
}

export interface ResponseOption {
  id: string
  label: string
  value: string
}

// ============================================
// SUPPORTING MATERIALS
// ============================================

export interface SupportingMaterial extends Identifiable {
  title: string
  type: 'facilitator_guide' | 'participant_handout' | 'aar_template' | 'reference' | 'checklist' | 'custom'
  format: 'markdown' | 'html' | 'pdf' | 'docx'
  content: string
  description?: string
}

// ============================================
// BRANCHING / DECISION TREES
// ============================================

/**
 * A single branch option at a decision point inject
 */
export interface BranchOption {
  id: string
  label: string                    // Display text (e.g., "Team decides to pay ransom")
  description?: string             // Longer explanation of what this choice represents
  target: BranchTarget             // Where this branch leads
  conditions?: BranchCondition[]   // Optional conditions for availability
  isDefault?: boolean              // Marks the "continue normally" option
  facilitatorNotes?: string        // Guidance for when to choose this branch
}

/**
 * Specifies where a branch leads to
 */
export interface BranchTarget {
  type: 'inject' | 'module' | 'end_module' | 'end_scenario' | 'insert_injects'
  moduleId?: string                // For cross-module jumps
  injectId?: string                // Target inject ID (for type 'inject')
  targetModuleId?: string          // Target module ID (for type 'module')
  insertedInjects?: InsertedInject[] // Dynamic injects (for type 'insert_injects')
  continueAfterInsert?: boolean    // Return to branch point after inserted injects
}

/**
 * Represents an inject that gets dynamically inserted based on a branch choice
 */
export interface InsertedInject {
  type: 'inline' | 'reference'
  inject?: Omit<Inject, 'id' | 'createdAt' | 'updatedAt' | 'order'> // For inline injects
  injectRefId?: string             // Reference to inject in scenario's injectLibrary
}

/**
 * Conditions for branch availability
 */
export interface BranchCondition {
  type: 'response_value' | 'time_threshold' | 'inject_acknowledged' | 'always'
  questionId?: string              // For response_value condition
  expectedValue?: string | string[]
  operator?: 'equals' | 'contains' | 'any_of' | 'none_of'
  timeThresholdMinutes?: number    // For time_threshold condition
  timeOperator?: 'greater_than' | 'less_than'
  targetInjectId?: string          // For inject_acknowledged condition
}

/**
 * Scenario-level branching configuration
 */
export interface BranchingSettings {
  enabled: boolean
  mode: 'facilitator_controlled' | 'participant_vote' | 'automatic'
  showBranchHistory: boolean       // Show path taken in progress tracker
  allowBacktracking: boolean       // Can facilitator go back to branch points
}

// ============================================
// FILE FORMAT
// ============================================

export interface ScenarioFile {
  $schema?: string
  version: string
  formatVersion: string
  metadata: {
    id: string
    title: string
    createdAt: string
    updatedAt: string
  }
  scenario: Scenario
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function createEmptyScenario(): Scenario {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    title: 'Untitled Scenario',
    description: '',
    version: '1.0.0',
    author: '',
    threatCategory: 'custom',
    tags: [],
    difficulty: 'intermediate',
    estimatedDuration: 120,
    targetAudience: [],
    objectives: [],
    modules: [],
    additionalMaterials: [],
    settings: {
      allowParticipantSkip: false,
      requireAllResponses: true,
      showInjectTimestamps: true,
      enableAnonymousResponses: false
    }
  }
}

export function createEmptyModule(order: number): Module {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    order,
    title: 'New Module',
    phase: 'detection',
    description: '',
    suggestedDuration: 30,
    injects: [],
    discussionQuestions: []
  }
}

export function createEmptyInject(order: number): Inject {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    order,
    title: 'New Inject',
    content: '',
    type: 'information',
    severity: 'medium',
    triggerTime: 0,
    attachments: [],
    relatedQuestionIds: []
  }
}

export function createEmptyQuestion(order: number): DiscussionQuestion {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    order,
    question: '',
    category: 'decision',
    responseType: 'text'
  }
}

export function createEmptyBranchOption(): BranchOption {
  return {
    id: crypto.randomUUID(),
    label: 'New Branch Option',
    target: {
      type: 'inject'
    }
  }
}

export function createDefaultBranchingSettings(): BranchingSettings {
  return {
    enabled: false,
    mode: 'facilitator_controlled',
    showBranchHistory: true,
    allowBacktracking: false
  }
}
