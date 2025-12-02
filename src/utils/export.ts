import type { Scenario, Module, Inject, DiscussionQuestion } from '../types/scenario.types'
import type { Exercise, ParticipantResponse, ResponsePackage } from '../types/exercise.types'

/**
 * Simple hash function for checksums.
 *
 * WARNING: This is NOT cryptographic - it's only for basic integrity checking
 * to detect accidental corruption. It should NOT be used for security purposes
 * as it can be easily forged.
 *
 * Uses djb2 algorithm variation: hash * 33 + char
 * The bitwise AND (hash & hash) truncates to 32-bit integer in JavaScript
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    // Truncate to 32-bit integer to prevent floating point issues
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(8, '0')
}

/**
 * Sanitize an inject by removing facilitator-only content
 */
function sanitizeInject(inject: Inject): Inject {
  return {
    ...inject,
    facilitatorNotes: undefined,
    expectedActions: undefined,
    conditions: undefined
  }
}

/**
 * Sanitize a discussion question by removing facilitator-only content
 */
function sanitizeQuestion(question: DiscussionQuestion): DiscussionQuestion {
  return {
    ...question,
    guidanceNotes: undefined,
    expectedThemes: undefined,
    followUpQuestions: undefined
  }
}

/**
 * Sanitize a module by removing facilitator-only content
 */
function sanitizeModule(module: Module): Module {
  return {
    ...module,
    facilitatorNotes: undefined,
    transitionGuidance: undefined,
    injects: module.injects.map(sanitizeInject),
    discussionQuestions: module.discussionQuestions.map(sanitizeQuestion)
  }
}

/**
 * Sanitize a scenario by removing all facilitator-only content
 */
export function sanitizeScenario(scenario: Scenario): Scenario {
  return {
    ...scenario,
    facilitatorGuide: undefined,
    modules: scenario.modules.map(sanitizeModule)
  }
}

/**
 * Create a participant package from a scenario and exercise
 */
export function createParticipantPackage(
  scenario: Scenario,
  exercise: Exercise | null,
  participantId: string,
  participantName: string
): {
  package: ParticipantPackage
  filename: string
} {
  const sanitizedScenario = sanitizeScenario(scenario)

  const pkg: ParticipantPackage = {
    $schema: 'https://ctep-framework.org/schema/v1/participant-package.json',
    version: '1.0.0',
    formatVersion: '1.0',
    exportedAt: new Date().toISOString(),
    exerciseId: exercise?.id || crypto.randomUUID(),
    exerciseTitle: exercise?.title || scenario.title,
    participantId,
    participantName,
    scenario: sanitizedScenario,
    checksum: ''
  }

  // Calculate checksum
  const contentForHash = JSON.stringify({
    exerciseId: pkg.exerciseId,
    scenario: pkg.scenario
  })
  pkg.checksum = simpleHash(contentForHash)

  // Generate filename
  const safeName = participantName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
  const safeTitle = scenario.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()
  const filename = `${safeTitle}-${safeName}.ctep-participant.json`

  return { package: pkg, filename }
}

/**
 * Create a response package from participant responses
 */
export function createResponsePackage(
  exerciseId: string,
  participantId: string,
  participantName: string,
  responses: ParticipantResponse[]
): {
  package: ResponsePackage
  filename: string
} {
  const pkg: ResponsePackage = {
    version: '1.0.0',
    exerciseId,
    participantId,
    participantName,
    responses,
    submittedAt: new Date().toISOString(),
    checksum: ''
  }

  // Calculate checksum
  const contentForHash = JSON.stringify({
    exerciseId: pkg.exerciseId,
    participantId: pkg.participantId,
    responses: pkg.responses
  })
  pkg.checksum = simpleHash(contentForHash)

  // Generate filename
  const safeName = participantName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
  const date = new Date().toISOString().split('T')[0]
  const filename = `responses-${safeName}-${date}.ctep-response.json`

  return { package: pkg, filename }
}

/**
 * Validate a participant package
 */
export function validateParticipantPackage(pkg: any): {
  valid: boolean
  error?: string
  package?: ParticipantPackage
} {
  if (!pkg || typeof pkg !== 'object') {
    return { valid: false, error: 'Invalid package format' }
  }

  if (!pkg.version || !pkg.exerciseId || !pkg.scenario) {
    return { valid: false, error: 'Missing required fields' }
  }

  if (!pkg.scenario.modules || !Array.isArray(pkg.scenario.modules)) {
    return { valid: false, error: 'Invalid scenario structure' }
  }

  // Verify checksum
  const contentForHash = JSON.stringify({
    exerciseId: pkg.exerciseId,
    scenario: pkg.scenario
  })
  const expectedChecksum = simpleHash(contentForHash)

  if (pkg.checksum && pkg.checksum !== expectedChecksum) {
    return { valid: false, error: 'Checksum mismatch - package may be corrupted' }
  }

  return { valid: true, package: pkg as ParticipantPackage }
}

/**
 * Validate a response package
 */
export function validateResponsePackage(pkg: any): {
  valid: boolean
  error?: string
  package?: ResponsePackage
} {
  if (!pkg || typeof pkg !== 'object') {
    return { valid: false, error: 'Invalid package format' }
  }

  if (!pkg.version || !pkg.exerciseId || !pkg.participantId || !pkg.responses) {
    return { valid: false, error: 'Missing required fields' }
  }

  if (!Array.isArray(pkg.responses)) {
    return { valid: false, error: 'Invalid responses format' }
  }

  // Verify checksum
  const contentForHash = JSON.stringify({
    exerciseId: pkg.exerciseId,
    participantId: pkg.participantId,
    responses: pkg.responses
  })
  const expectedChecksum = simpleHash(contentForHash)

  if (pkg.checksum && pkg.checksum !== expectedChecksum) {
    return { valid: false, error: 'Checksum mismatch - package may be corrupted' }
  }

  return { valid: true, package: pkg as ResponsePackage }
}

// Type definitions
export interface ParticipantPackage {
  $schema?: string
  version: string
  formatVersion: string
  exportedAt: string
  exerciseId: string
  exerciseTitle: string
  participantId: string
  participantName: string
  scenario: Scenario
  checksum: string
}
