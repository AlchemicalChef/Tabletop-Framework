import type { Scenario } from '../types/scenario.types'

// Import all scenarios from individual modules
import {
  ransomwareHealthcareScenario,
  becCeoFraudScenario,
  cisaRansomwareScenario,
  cisaSupplyChainScenario,
  cisaOssScenario,
  scatteredSpiderScenario,
  shinyHuntersScenario,
  revilSupplyChainScenario
} from './scenarios'

export interface LibraryEntry {
  id: string
  title: string
  category: string
  difficulty: string
  duration: number
  description: string
  tags: string[]
  moduleCount: number
  injectCount: number
  questionCount: number
  scenario: Scenario
}

// Pre-built CTEP Scenarios
export const libraryScenarios: LibraryEntry[] = [
  ransomwareHealthcareScenario,
  becCeoFraudScenario,
  cisaRansomwareScenario,
  cisaSupplyChainScenario,
  cisaOssScenario,
  scatteredSpiderScenario,
  shinyHuntersScenario,
  revilSupplyChainScenario
]
