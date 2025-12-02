import { useState, useEffect } from 'react'
import { useExerciseStore } from '../stores/exercise.store'
import { useScenarioStore } from '../stores/scenario.store'
import type { Scenario, ScenarioFile } from '../types/scenario.types'
import type { ParticipantResponse } from '../types/exercise.types'
import Timer from '../components/exercise/Timer'
import FacilitatorControls from '../components/exercise/FacilitatorControls'
import InjectDisplay from '../components/exercise/InjectDisplay'
import ProgressTracker from '../components/exercise/ProgressTracker'
import DiscussionPanel from '../components/exercise/DiscussionPanel'
import ExportParticipantModal from '../components/exercise/ExportParticipantModal'
import ImportResponsesModal from '../components/exercise/ImportResponsesModal'
import AARGenerator from '../components/exercise/AARGenerator'

type View = 'home' | 'author' | 'runner' | 'library' | 'participant'

interface ExerciseRunnerPageProps {
  onNavigate: (view: View) => void
}

export default function ExerciseRunnerPage({ onNavigate }: ExerciseRunnerPageProps) {
  const {
    currentExercise,
    linkedScenario,
    isRunning,
    elapsedTime,
    moduleElapsedTime,
    createExercise,
    loadExercise,
    startExercise,
    pauseExercise,
    resumeExercise,
    completeExercise,
    resetExercise,
    advanceToNextInject,
    advanceToNextModule,
    goToModule,
    goToInject,
    logInjectDisplay,
    acknowledgeInject,
    submitResponse
  } = useExerciseStore()

  const { currentScenario } = useScenarioStore()
  const [activePanel, setActivePanel] = useState<'inject' | 'discussion'>('inject')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showLoadOptions, setShowLoadOptions] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showAARModal, setShowAARModal] = useState(false)

  // Get current module and inject
  const currentModule = linkedScenario?.modules.find(
    m => m.id === currentExercise?.progress.currentModuleId
  )
  const currentInject = currentModule?.injects.find(
    i => i.id === currentExercise?.progress.currentInjectId
  )

  // Calculate navigation state
  const currentModuleIndex = currentExercise?.progress.currentModuleIndex ?? 0
  const currentInjectIndex = currentExercise?.progress.currentInjectIndex ?? 0
  const totalModules = linkedScenario?.modules.length ?? 0
  const totalInjectsInModule = currentModule?.injects.length ?? 0

  const canAdvanceInject = currentInjectIndex < totalInjectsInModule - 1
  const canAdvanceModule = currentModuleIndex < totalModules - 1
  const canGoBack = currentInjectIndex > 0 || currentModuleIndex > 0

  // Log inject display when it changes
  useEffect(() => {
    if (currentInject && currentExercise) {
      const alreadyLogged = currentExercise.injectLogs.some(
        log => log.injectId === currentInject.id
      )
      if (!alreadyLogged) {
        logInjectDisplay(currentInject.id)
      }
    }
  }, [currentInject, currentExercise, logInjectDisplay])

  const handleLoadScenarioFile = async () => {
    const filePath = await window.electronAPI?.openFileDialog({
      filters: [
        { name: 'CTEP Scenarios', extensions: ['ctep.json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (!filePath) return

    const result = await window.electronAPI?.readFile(filePath)
    if (!result?.success || !result.data) {
      console.error('Failed to read file:', result?.error)
      return
    }

    try {
      const fileContent: ScenarioFile = JSON.parse(result.data)
      const scenario = fileContent.scenario
      createExercise(scenario)
      setShowLoadOptions(false)
    } catch (error) {
      console.error('Failed to parse scenario:', error)
    }
  }

  const handleLoadCurrentScenario = () => {
    if (currentScenario) {
      createExercise(currentScenario)
      setShowLoadOptions(false)
    }
  }

  const handlePreviousInject = () => {
    if (!currentExercise || !linkedScenario) return

    if (currentInjectIndex > 0) {
      // Go to previous inject in current module
      const prevInject = currentModule?.injects[currentInjectIndex - 1]
      if (prevInject && currentModule) {
        goToInject(currentModule.id, prevInject.id)
      }
    } else if (currentModuleIndex > 0) {
      // Go to last inject of previous module
      const prevModule = linkedScenario.modules[currentModuleIndex - 1]
      if (prevModule && prevModule.injects.length > 0) {
        const lastInject = prevModule.injects[prevModule.injects.length - 1]
        goToInject(prevModule.id, lastInject.id)
      }
    }
  }

  const handleAddResponse = (questionId: string, response: string) => {
    if (!currentExercise || !currentModule) return

    submitResponse({
      exerciseId: currentExercise.id,
      participantId: 'facilitator',
      questionId,
      moduleId: currentModule.id,
      responseType: 'text',
      textResponse: response,
      submittedAt: new Date().toISOString(),
      isAnonymous: false
    })
  }

  const handleImportResponses = (responses: ParticipantResponse[]) => {
    responses.forEach(response => {
      submitResponse(response)
    })
  }

  const isInjectAcknowledged = currentInject
    ? currentExercise?.injectLogs.some(
        log => log.injectId === currentInject.id && log.acknowledgedAt
      )
    : false

  // No exercise loaded - show load options
  if (!currentExercise || !linkedScenario) {
    return (
      <div className="page">
        <div className="page-header">
          <div className="flex items-center gap-md">
            <button className="btn btn-ghost" onClick={() => onNavigate('home')}>
              ← Back
            </button>
            <h1 className="page-title">Exercise Runner</h1>
          </div>
        </div>

        <div className="page-content">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--spacing-lg)',
              fontSize: '2rem'
            }}>
              ▶
            </div>
            <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Start an Exercise</h2>
            <p style={{
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-lg)',
              maxWidth: '400px'
            }}>
              Load a scenario to begin running a tabletop exercise with your team.
            </p>

            <div className="flex gap-md" style={{ flexDirection: 'column', width: '300px' }}>
              {currentScenario && (
                <button
                  className="btn btn-primary"
                  onClick={handleLoadCurrentScenario}
                  style={{ width: '100%' }}
                >
                  Run Current Scenario
                  <span style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    opacity: 0.8,
                    marginTop: '2px'
                  }}>
                    {currentScenario.title}
                  </span>
                </button>
              )}

              <button
                className="btn btn-secondary"
                onClick={handleLoadScenarioFile}
                style={{ width: '100%' }}
              >
                Load Scenario File
              </button>

              <button
                className="btn btn-ghost"
                onClick={() => onNavigate('library')}
                style={{ width: '100%' }}
              >
                Browse Library
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Exercise loaded - show runner UI
  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-md">
          <button
            className="btn btn-ghost"
            onClick={() => {
              if (currentExercise.status === 'active') {
                if (confirm('Exercise is running. Are you sure you want to leave?')) {
                  pauseExercise()
                  onNavigate('home')
                }
              } else {
                onNavigate('home')
              }
            }}
          >
            ← Back
          </button>
          <div>
            <h1 className="page-title">{linkedScenario.title}</h1>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {linkedScenario.threatCategory.replace('_', ' ')} · {linkedScenario.difficulty}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-lg">
          <div className="flex gap-sm">
            <button
              className="btn btn-ghost"
              onClick={() => setShowExportModal(true)}
              title="Export participant packages"
            >
              Export Packages
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => setShowImportModal(true)}
              title="Import participant responses"
            >
              Import Responses
            </button>
          </div>
          <Timer
            elapsedSeconds={moduleElapsedTime}
            isRunning={isRunning}
            label="Module"
          />
          <Timer
            elapsedSeconds={elapsedTime}
            isRunning={isRunning}
            label="Total"
            size="large"
          />
        </div>
      </div>

      {/* Controls Bar */}
      <div style={{
        padding: 'var(--spacing-md) var(--spacing-lg)',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-secondary)'
      }}>
        <FacilitatorControls
          status={currentExercise.status}
          canAdvanceInject={canAdvanceInject}
          canAdvanceModule={canAdvanceModule}
          canGoBack={canGoBack}
          onStart={startExercise}
          onPause={pauseExercise}
          onResume={resumeExercise}
          onComplete={completeExercise}
          onAdvanceInject={advanceToNextInject}
          onAdvanceModule={advanceToNextModule}
          onPreviousInject={handlePreviousInject}
        />
      </div>

      {/* Main Content */}
      <div className="page-content" style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
        {/* Left Sidebar - Progress */}
        <div style={{ width: '280px', flexShrink: 0 }}>
          <ProgressTracker
            modules={linkedScenario.modules}
            progress={currentExercise.progress}
            onModuleClick={goToModule}
            onInjectClick={goToInject}
          />
        </div>

        {/* Center - Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Panel Tabs */}
          <div className="nav-tabs" style={{
            marginBottom: 'var(--spacing-lg)',
            display: 'inline-flex'
          }}>
            <button
              className={`nav-tab ${activePanel === 'inject' ? 'active' : ''}`}
              onClick={() => setActivePanel('inject')}
            >
              Current Inject
            </button>
            <button
              className={`nav-tab ${activePanel === 'discussion' ? 'active' : ''}`}
              onClick={() => setActivePanel('discussion')}
            >
              Discussion ({currentModule?.discussionQuestions.length || 0})
            </button>
          </div>

          {/* Inject Panel */}
          {activePanel === 'inject' && (
            <InjectDisplay
              inject={currentInject || null}
              moduleTitle={currentModule?.title || ''}
              injectNumber={currentInjectIndex + 1}
              totalInjects={totalInjectsInModule}
              showFacilitatorNotes={true}
              onAcknowledge={() => currentInject && acknowledgeInject(currentInject.id)}
              isAcknowledged={isInjectAcknowledged}
            />
          )}

          {/* Discussion Panel */}
          {activePanel === 'discussion' && currentModule && (
            <DiscussionPanel
              questions={currentModule.discussionQuestions}
              responses={currentExercise.responses.filter(
                r => r.moduleId === currentModule.id
              )}
              currentQuestionIndex={currentQuestionIndex}
              showFacilitatorNotes={true}
              onQuestionSelect={setCurrentQuestionIndex}
              onAddResponse={handleAddResponse}
            />
          )}
        </div>

        {/* Right Sidebar - Quick Info */}
        <div style={{ width: '250px', flexShrink: 0 }}>
          {/* Module Info Card */}
          <div style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-md)'
          }}>
            <div style={{
              fontSize: '0.625rem',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              marginBottom: 'var(--spacing-xs)'
            }}>
              Current Module
            </div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: 'var(--spacing-xs)'
            }}>
              {currentModule?.title || 'No module selected'}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)'
            }}>
              Phase: {currentModule?.phase.replace('_', ' ')}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)'
            }}>
              Duration: ~{currentModule?.suggestedDuration || 0} min
            </div>
          </div>

          {/* Facilitator Notes */}
          {currentModule?.facilitatorNotes && (
            <div style={{
              backgroundColor: 'rgba(159, 122, 234, 0.1)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(159, 122, 234, 0.3)',
              padding: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-md)'
            }}>
              <div style={{
                fontSize: '0.625rem',
                color: '#9f7aea',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginBottom: 'var(--spacing-xs)'
              }}>
                Module Notes
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                margin: 0,
                lineHeight: 1.5
              }}>
                {currentModule.facilitatorNotes}
              </p>
            </div>
          )}

          {/* Transition Guidance */}
          {currentModule?.transitionGuidance && canAdvanceModule && (
            <div style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              padding: 'var(--spacing-md)'
            }}>
              <div style={{
                fontSize: '0.625rem',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                marginBottom: 'var(--spacing-xs)'
              }}>
                Transition to Next Module
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                margin: 0,
                lineHeight: 1.5
              }}>
                {currentModule.transitionGuidance}
              </p>
            </div>
          )}

          {/* Exercise Complete */}
          {currentExercise.status === 'completed' && (
            <div style={{
              backgroundColor: 'rgba(72, 187, 120, 0.1)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(72, 187, 120, 0.3)',
              padding: 'var(--spacing-md)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.5rem',
                marginBottom: 'var(--spacing-sm)'
              }}>
                ✓
              </div>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-severity-low)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                Exercise Complete
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--spacing-md)'
              }}>
                Total time: {Math.floor(elapsedTime / 60)} minutes
              </div>
              <button
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={() => setShowAARModal(true)}
              >
                Generate AAR
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Export Participant Modal */}
      {showExportModal && (
        <ExportParticipantModal
          scenario={linkedScenario}
          exercise={currentExercise}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Import Responses Modal */}
      {showImportModal && (
        <ImportResponsesModal
          exerciseId={currentExercise.id}
          onImport={handleImportResponses}
          onClose={() => setShowImportModal(false)}
        />
      )}

      {/* AAR Generator Modal */}
      {showAARModal && (
        <AARGenerator
          exercise={currentExercise}
          scenario={linkedScenario}
          onClose={() => setShowAARModal(false)}
        />
      )}
    </div>
  )
}
