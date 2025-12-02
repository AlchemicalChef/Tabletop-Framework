import { useState } from 'react'
import type { Scenario, Module, Inject, DiscussionQuestion } from '../types/scenario.types'
import type { ParticipantResponse } from '../types/exercise.types'
import { validateParticipantPackage, createResponsePackage, type ParticipantPackage } from '../utils/export'

type View = 'home' | 'author' | 'runner' | 'library' | 'participant'

interface ParticipantPortalPageProps {
  onNavigate: (view: View) => void
}

const SEVERITY_COLORS: Record<string, string> = {
  low: '#48bb78',
  medium: '#ecc94b',
  high: '#ed8936',
  critical: '#f56565'
}

const CATEGORY_COLORS: Record<string, string> = {
  decision: '#f56565',
  coordination: '#4299e1',
  communication: '#48bb78',
  technical: '#ed8936',
  policy: '#9f7aea',
  resource: '#ecc94b',
  lessons_learned: '#a0aec0'
}

export default function ParticipantPortalPage({ onNavigate }: ParticipantPortalPageProps) {
  const [package_, setPackage] = useState<ParticipantPackage | null>(null)
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [currentInjectIndex, setCurrentInjectIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'scenario' | 'questions'>('scenario')
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const handleOpenPackage = async () => {
    const filePath = await window.electronAPI?.openFileDialog({
      filters: [
        { name: 'CTEP Participant Package', extensions: ['ctep-participant.json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (!filePath) return

    const result = await window.electronAPI?.readFile(filePath)
    if (!result?.success || !result.data) {
      alert('Failed to read package file')
      return
    }

    try {
      const parsed = JSON.parse(result.data)
      const validation = validateParticipantPackage(parsed)

      if (!validation.valid) {
        alert(`Invalid package: ${validation.error}`)
        return
      }

      setPackage(validation.package!)
      setCurrentModuleIndex(0)
      setCurrentInjectIndex(0)
      setResponses({})
      setExportSuccess(false)
    } catch (error) {
      alert('Failed to parse package file')
    }
  }

  const handleExportResponses = async () => {
    if (!package_) return

    setIsExporting(true)

    try {
      // Convert responses to ParticipantResponse array
      const responseArray: ParticipantResponse[] = Object.entries(responses)
        .filter(([_, value]) => value.trim())
        .map(([questionId, textResponse]) => {
          // Find the module containing this question
          const module = package_.scenario.modules.find(m =>
            m.discussionQuestions.some(q => q.id === questionId)
          )

          return {
            id: crypto.randomUUID(),
            exerciseId: package_.exerciseId,
            participantId: package_.participantId,
            questionId,
            moduleId: module?.id || '',
            responseType: 'text' as const,
            textResponse,
            submittedAt: new Date().toISOString(),
            isAnonymous: false
          }
        })

      if (responseArray.length === 0) {
        alert('No responses to export. Please answer at least one question.')
        setIsExporting(false)
        return
      }

      const { package: responsePkg, filename } = createResponsePackage(
        package_.exerciseId,
        package_.participantId,
        package_.participantName,
        responseArray
      )

      const filePath = await window.electronAPI?.saveFileDialog({
        defaultPath: filename,
        filters: [{ name: 'CTEP Response File', extensions: ['ctep-response.json'] }]
      })

      if (filePath) {
        const content = JSON.stringify(responsePkg, null, 2)
        const writeResult = await window.electronAPI?.writeFile(filePath, content)

        if (writeResult?.success) {
          setExportSuccess(true)
        } else {
          alert('Failed to save response file')
        }
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export responses')
    } finally {
      setIsExporting(false)
    }
  }

  const currentModule = package_?.scenario.modules[currentModuleIndex]
  const currentInject = currentModule?.injects[currentInjectIndex]

  const totalQuestions = package_?.scenario.modules.reduce(
    (sum, m) => sum + m.discussionQuestions.length, 0
  ) || 0

  const answeredQuestions = Object.values(responses).filter(r => r.trim()).length

  // Not loaded state
  if (!package_) {
    return (
      <div className="page">
        <div className="page-header">
          <div className="flex items-center gap-md">
            <button className="btn btn-ghost" onClick={() => onNavigate('home')}>
              ← Back
            </button>
            <h1 className="page-title">Participant Portal</h1>
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
              👤
            </div>
            <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Participant Mode</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)', maxWidth: '500px' }}>
              Open a participant package (.ctep-participant.json) provided by your exercise facilitator
              to view the scenario and submit your responses.
            </p>

            <button className="btn btn-primary" onClick={handleOpenPackage}>
              Open Participant Package
            </button>

            <div style={{
              marginTop: 'var(--spacing-2xl)',
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              maxWidth: '500px'
            }}>
              <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: '1rem' }}>How it works</h3>
              <ol style={{
                textAlign: 'left',
                color: 'var(--color-text-secondary)',
                paddingLeft: 'var(--spacing-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)'
              }}>
                <li>Your facilitator will send you a participant package file</li>
                <li>Open the package to view the exercise scenario and injects</li>
                <li>Read through the situation and answer discussion questions</li>
                <li>Export your responses and send them back to the facilitator</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Loaded state - show exercise
  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-md">
          <button
            className="btn btn-ghost"
            onClick={() => {
              if (answeredQuestions > 0 && !exportSuccess) {
                if (confirm('You have unsaved responses. Are you sure you want to leave?')) {
                  setPackage(null)
                }
              } else {
                setPackage(null)
              }
            }}
          >
            ← Close
          </button>
          <div>
            <h1 className="page-title">{package_.scenario.title}</h1>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Participant: {package_.participantName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-md">
          <div style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            backgroundColor: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem'
          }}>
            {answeredQuestions} / {totalQuestions} questions answered
          </div>
          <button
            className="btn btn-primary"
            onClick={handleExportResponses}
            disabled={isExporting || answeredQuestions === 0}
          >
            {isExporting ? 'Exporting...' : 'Export Responses'}
          </button>
        </div>
      </div>

      {/* Export Success Banner */}
      {exportSuccess && (
        <div style={{
          padding: 'var(--spacing-md) var(--spacing-lg)',
          backgroundColor: 'rgba(72, 187, 120, 0.1)',
          borderBottom: '1px solid rgba(72, 187, 120, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--spacing-sm)'
        }}>
          <span style={{ color: 'var(--color-severity-low)' }}>✓</span>
          <span>Responses exported successfully. Send the file to your facilitator.</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{
        padding: 'var(--spacing-sm) var(--spacing-lg)',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-secondary)'
      }}>
        <div className="nav-tabs" style={{ display: 'inline-flex' }}>
          <button
            className={`nav-tab ${activeTab === 'scenario' ? 'active' : ''}`}
            onClick={() => setActiveTab('scenario')}
          >
            Scenario
          </button>
          <button
            className={`nav-tab ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            Questions ({totalQuestions})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-content" style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
        {/* Sidebar - Module Navigation */}
        <div style={{ width: '250px', flexShrink: 0 }}>
          <div style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            padding: 'var(--spacing-md)'
          }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
              Modules
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              {package_.scenario.modules.map((module, index) => (
                <button
                  key={module.id}
                  onClick={() => {
                    setCurrentModuleIndex(index)
                    setCurrentInjectIndex(0)
                  }}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    backgroundColor: index === currentModuleIndex
                      ? 'var(--color-primary)'
                      : 'transparent',
                    color: index === currentModuleIndex
                      ? 'white'
                      : 'var(--color-text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <div style={{ fontWeight: 500 }}>{module.title}</div>
                  <div style={{
                    fontSize: '0.75rem',
                    opacity: 0.8,
                    marginTop: '2px'
                  }}>
                    {module.injects.length} injects · {module.discussionQuestions.length} questions
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Info */}
          <div style={{
            marginTop: 'var(--spacing-md)',
            backgroundColor: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            padding: 'var(--spacing-md)'
          }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
              About This Exercise
            </h3>
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-secondary)',
              margin: 0,
              lineHeight: 1.5
            }}>
              {package_.scenario.description}
            </p>
          </div>
        </div>

        {/* Main Panel */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {activeTab === 'scenario' && currentModule && (
            <>
              {/* Module Header */}
              <div style={{
                marginBottom: 'var(--spacing-lg)',
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)'
              }}>
                <div style={{
                  fontSize: '0.625rem',
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  Module {currentModuleIndex + 1} · {currentModule.phase.replace('_', ' ')}
                </div>
                <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{currentModule.title}</h2>
                {currentModule.description && (
                  <p style={{
                    marginTop: 'var(--spacing-sm)',
                    marginBottom: 0,
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.875rem'
                  }}>
                    {currentModule.description}
                  </p>
                )}
              </div>

              {/* Inject Navigation */}
              {currentModule.injects.length > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setCurrentInjectIndex(Math.max(0, currentInjectIndex - 1))}
                    disabled={currentInjectIndex === 0}
                  >
                    ← Previous
                  </button>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    Inject {currentInjectIndex + 1} of {currentModule.injects.length}
                  </span>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setCurrentInjectIndex(Math.min(currentModule.injects.length - 1, currentInjectIndex + 1))}
                    disabled={currentInjectIndex === currentModule.injects.length - 1}
                  >
                    Next →
                  </button>
                </div>
              )}

              {/* Current Inject */}
              {currentInject && (
                <div style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden'
                }}>
                  {/* Inject Header */}
                  <div style={{
                    padding: 'var(--spacing-md) var(--spacing-lg)',
                    backgroundColor: `${SEVERITY_COLORS[currentInject.severity]}15`,
                    borderBottom: `2px solid ${SEVERITY_COLORS[currentInject.severity]}`
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <span style={{
                          padding: '2px 8px',
                          backgroundColor: `${SEVERITY_COLORS[currentInject.severity]}30`,
                          color: SEVERITY_COLORS[currentInject.severity],
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          {currentInject.severity}
                        </span>
                        <span style={{
                          marginLeft: 'var(--spacing-sm)',
                          fontSize: '0.75rem',
                          color: 'var(--color-text-muted)',
                          textTransform: 'capitalize'
                        }}>
                          {currentInject.type.replace('_', ' ')}
                        </span>
                      </div>
                      {currentInject.triggerTime !== undefined && (
                        <span style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-text-muted)'
                        }}>
                          T+{currentInject.triggerTime} min
                        </span>
                      )}
                    </div>
                    <h3 style={{ margin: 'var(--spacing-sm) 0 0 0', fontSize: '1rem' }}>
                      {currentInject.title}
                    </h3>
                  </div>

                  {/* Inject Content */}
                  <div style={{ padding: 'var(--spacing-lg)' }}>
                    {currentInject.source && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-muted)',
                        marginBottom: 'var(--spacing-sm)'
                      }}>
                        From: {currentInject.source}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: '0.9375rem',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {currentInject.content}
                    </div>

                    {/* Attachments */}
                    {currentInject.attachments && currentInject.attachments.length > 0 && (
                      <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        <div style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-text-muted)',
                          marginBottom: 'var(--spacing-sm)'
                        }}>
                          Attachments:
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                          {currentInject.attachments.map((att, i) => (
                            <div
                              key={i}
                              style={{
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                backgroundColor: 'var(--color-bg-tertiary)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.875rem'
                              }}
                            >
                              {att.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentModule.injects.length === 0 && (
                <div style={{
                  padding: 'var(--spacing-xl)',
                  textAlign: 'center',
                  color: 'var(--color-text-muted)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)'
                }}>
                  No injects in this module.
                </div>
              )}
            </>
          )}

          {activeTab === 'questions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              {package_.scenario.modules.map((module, moduleIdx) => (
                <div key={module.id}>
                  <h3 style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    marginBottom: 'var(--spacing-md)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    {module.title}
                  </h3>
                  {module.discussionQuestions.length === 0 ? (
                    <p style={{
                      color: 'var(--color-text-muted)',
                      fontSize: '0.875rem',
                      fontStyle: 'italic'
                    }}>
                      No questions for this module.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                      {module.discussionQuestions.map((question, qIdx) => (
                        <div
                          key={question.id}
                          style={{
                            backgroundColor: 'var(--color-bg-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--color-border)',
                            padding: 'var(--spacing-lg)'
                          }}
                        >
                          {/* Question Header */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            marginBottom: 'var(--spacing-md)'
                          }}>
                            <span style={{
                              padding: '2px 8px',
                              backgroundColor: `${CATEGORY_COLORS[question.category]}20`,
                              color: CATEGORY_COLORS[question.category],
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              textTransform: 'capitalize'
                            }}>
                              {question.category.replace('_', ' ')}
                            </span>
                            {responses[question.id]?.trim() && (
                              <span style={{
                                color: 'var(--color-severity-low)',
                                fontSize: '0.75rem'
                              }}>
                                ✓ Answered
                              </span>
                            )}
                          </div>

                          {/* Question Text */}
                          <p style={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            marginBottom: 'var(--spacing-md)',
                            lineHeight: 1.5
                          }}>
                            {question.question}
                          </p>

                          {/* Context */}
                          {question.context && (
                            <div style={{
                              padding: 'var(--spacing-md)',
                              backgroundColor: 'var(--color-bg-tertiary)',
                              borderRadius: 'var(--radius-md)',
                              marginBottom: 'var(--spacing-md)',
                              fontSize: '0.875rem',
                              color: 'var(--color-text-secondary)'
                            }}>
                              {question.context}
                            </div>
                          )}

                          {/* Response Input */}
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '0.75rem',
                              color: 'var(--color-text-muted)',
                              marginBottom: 'var(--spacing-xs)'
                            }}>
                              Your Response
                            </label>
                            <textarea
                              className="input"
                              rows={4}
                              value={responses[question.id] || ''}
                              onChange={(e) => setResponses({
                                ...responses,
                                [question.id]: e.target.value
                              })}
                              placeholder="Enter your response..."
                              style={{ resize: 'vertical' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
