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
  revilSupplyChainScenario,
  fin7CarbanakScenario,
  magecartRetailScenario,
  lapsusExtortionScenario,
  apt29SupplyChainScenario,
  voltTyphoonEnergyScenario,
  lazarusSwiftScenario,
  lockbitManufacturingScenario,
  blackcatEnergyScenario,
  clopHealthcareScenario
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
  revilSupplyChainScenario,
  fin7CarbanakScenario,
  magecartRetailScenario,
  lapsusExtortionScenario,
  // Nation-State APT Scenarios
  apt29SupplyChainScenario,
  voltTyphoonEnergyScenario,
  lazarusSwiftScenario,
  // Ransomware Scenarios
  lockbitManufacturingScenario,
  blackcatEnergyScenario,
  clopHealthcareScenario
]
