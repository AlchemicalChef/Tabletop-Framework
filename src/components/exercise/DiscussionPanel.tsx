import { useState, useEffect, useRef } from 'react'
import type { DiscussionQuestion } from '../../types/scenario.types'
import type { ParticipantResponse, DiscussionState, DiscussionStatus } from '../../types/exercise.types'

interface DiscussionPanelProps {
  questions: DiscussionQuestion[]
  responses: ParticipantResponse[]
  currentQuestionIndex: number
  showFacilitatorNotes: boolean
  onQuestionSelect: (index: number) => void
  onAddResponse: (questionId: string, response: string) => void
  // Discussion state tracking (optional for backwards compatibility)
  discussionStates?: Record<string, DiscussionState>
  onStartDiscussion?: (questionId: string) => void
  onConcludeDiscussion?: (questionId: string) => void
  onAddKeyTheme?: (questionId: string, theme: string) => void
  onRemoveKeyTheme?: (questionId: string, theme: string) => void
  onHighlightResponse?: (questionId: string, responseId: string) => void
  onUnhighlightResponse?: (questionId: string, responseId: string) => void
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

const STATUS_CONFIG: Record<DiscussionStatus, { label: string; color: string; icon: string }> = {
  not_started: { label: 'Not Started', color: 'var(--color-text-muted)', icon: '○' },
  in_progress: { label: 'In Progress', color: 'var(--color-accent-primary)', icon: '●' },
  concluded: { label: 'Concluded', color: 'var(--color-severity-low)', icon: '✓' }
}

function formatTimeSpent(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (minutes < 60) return `${minutes}m ${secs}s`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export default function DiscussionPanel({
  questions,
  responses,
  currentQuestionIndex,
  showFacilitatorNotes,
  onQuestionSelect,
  onAddResponse,
  discussionStates,
  onStartDiscussion,
  onConcludeDiscussion,
  onAddKeyTheme,
  onRemoveKeyTheme,
  onHighlightResponse,
  onUnhighlightResponse
}: DiscussionPanelProps) {
  const [newResponse, setNewResponse] = useState('')
  const [newTheme, setNewTheme] = useState('')
  const [localTimeSpent, setLocalTimeSpent] = useState(0)
  const timerRef = useRef<number | null>(null)
  const currentQuestion = questions[currentQuestionIndex]

  // Get discussion state for current question
  const currentDiscussionState = currentQuestion && discussionStates
    ? discussionStates[currentQuestion.id]
    : undefined

  const discussionStatus = currentDiscussionState?.status || 'not_started'

  // Track local time for in-progress discussions
  useEffect(() => {
    if (discussionStatus === 'in_progress' && currentDiscussionState) {
      // Start local timer from the saved time
      setLocalTimeSpent(currentDiscussionState.timeSpent)

      timerRef.current = window.setInterval(() => {
        setLocalTimeSpent(prev => prev + 1)
      }, 1000)
    } else {
      // Clear timer when not in progress
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      // Reset to saved time
      setLocalTimeSpent(currentDiscussionState?.timeSpent || 0)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [discussionStatus, currentDiscussionState?.timeSpent, currentQuestion?.id])

  const getResponsesForQuestion = (questionId: string) => {
    return responses.filter(r => r.questionId === questionId)
  }

  const getDiscussionState = (questionId: string): DiscussionState | undefined => {
    return discussionStates?.[questionId]
  }

  const handleStartDiscussion = () => {
    if (currentQuestion && onStartDiscussion) {
      onStartDiscussion(currentQuestion.id)
    }
  }

  const handleConcludeDiscussion = () => {
    if (currentQuestion && onConcludeDiscussion) {
      onConcludeDiscussion(currentQuestion.id)
    }
  }

  const handleAddTheme = () => {
    if (currentQuestion && onAddKeyTheme && newTheme.trim()) {
      onAddKeyTheme(currentQuestion.id, newTheme.trim())
      setNewTheme('')
    }
  }

  const handleRemoveTheme = (theme: string) => {
    if (currentQuestion && onRemoveKeyTheme) {
      onRemoveKeyTheme(currentQuestion.id, theme)
    }
  }

  const handleToggleHighlight = (responseId: string, isHighlighted: boolean) => {
    if (currentQuestion) {
      if (isHighlighted && onUnhighlightResponse) {
        onUnhighlightResponse(currentQuestion.id, responseId)
      } else if (!isHighlighted && onHighlightResponse) {
        onHighlightResponse(currentQuestion.id, responseId)
      }
    }
  }

  if (questions.length === 0) {
    return (
      <div style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        padding: 'var(--spacing-xl)',
        textAlign: 'center'
      }}>
        <p style={{ color: 'var(--color-text-muted)' }}>
          No discussion questions for this module.
        </p>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: 'var(--color-bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: 'var(--spacing-md) var(--spacing-lg)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>
          Discussion Questions
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          {/* Summary stats */}
          {discussionStates && (
            <div style={{ display: 'flex', gap: 'var(--spacing-xs)', fontSize: '0.625rem' }}>
              <span style={{ color: 'var(--color-severity-low)' }}>
                {questions.filter(q => getDiscussionState(q.id)?.status === 'concluded').length} done
              </span>
              <span style={{ color: 'var(--color-text-muted)' }}>·</span>
              <span style={{ color: 'var(--color-accent-primary)' }}>
                {questions.filter(q => getDiscussionState(q.id)?.status === 'in_progress').length} active
              </span>
            </div>
          )}
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)'
          }}>
            {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
      </div>

      {/* Question Tabs */}
      <div style={{
        display: 'flex',
        gap: '2px',
        padding: 'var(--spacing-sm)',
        backgroundColor: 'var(--color-bg-tertiary)',
        overflowX: 'auto'
      }}>
        {questions.map((q, i) => {
          const categoryColor = CATEGORY_COLORS[q.category] || '#a0aec0'
          const hasResponses = getResponsesForQuestion(q.id).length > 0
          const qDiscussionState = getDiscussionState(q.id)
          const qStatus = qDiscussionState?.status || 'not_started'
          const statusConfig = STATUS_CONFIG[qStatus]

          return (
            <button
              key={q.id}
              onClick={() => onQuestionSelect(i)}
              style={{
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: i === currentQuestionIndex
                  ? 'var(--color-bg-elevated)'
                  : 'transparent',
                color: i === currentQuestionIndex
                  ? 'var(--color-text-primary)'
                  : 'var(--color-text-muted)',
                fontSize: '0.75rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
                position: 'relative'
              }}
            >
              {/* Status indicator */}
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: qStatus === 'not_started'
                  ? (hasResponses ? categoryColor : 'var(--color-bg-elevated)')
                  : statusConfig.color,
                border: qStatus === 'in_progress' ? `1px solid ${statusConfig.color}` : 'none',
                animation: qStatus === 'in_progress' ? 'statusPulse 1.5s ease-in-out infinite' : undefined
              }} />
              Q{i + 1}
              {qStatus === 'concluded' && (
                <span style={{ fontSize: '0.625rem', color: 'var(--color-severity-low)' }}>✓</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <div style={{ padding: 'var(--spacing-lg)' }}>
          {/* Discussion Controls */}
          {(onStartDiscussion || onConcludeDiscussion) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-md)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--color-bg-tertiary)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <span style={{
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  color: STATUS_CONFIG[discussionStatus].color,
                  textTransform: 'uppercase'
                }}>
                  {STATUS_CONFIG[discussionStatus].icon} {STATUS_CONFIG[discussionStatus].label}
                </span>
                {(discussionStatus === 'in_progress' || discussionStatus === 'concluded') && (
                  <span style={{
                    fontSize: '0.625rem',
                    color: 'var(--color-text-muted)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {formatTimeSpent(localTimeSpent)}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                {discussionStatus === 'not_started' && onStartDiscussion && (
                  <button
                    onClick={handleStartDiscussion}
                    className="btn btn-primary"
                    style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                  >
                    Start Discussion
                  </button>
                )}
                {discussionStatus === 'in_progress' && onConcludeDiscussion && (
                  <button
                    onClick={handleConcludeDiscussion}
                    className="btn btn-secondary"
                    style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                  >
                    Mark Concluded
                  </button>
                )}
                {discussionStatus === 'concluded' && onStartDiscussion && (
                  <button
                    onClick={handleStartDiscussion}
                    className="btn btn-ghost"
                    style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Category Badge */}
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <span style={{
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: `${CATEGORY_COLORS[currentQuestion.category]}20`,
              color: CATEGORY_COLORS[currentQuestion.category],
              fontSize: '0.75rem',
              fontWeight: 500,
              textTransform: 'capitalize'
            }}>
              {currentQuestion.category.replace('_', ' ')}
            </span>
            {currentQuestion.suggestedDiscussionTime && (
              <span style={{
                marginLeft: 'var(--spacing-sm)',
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)'
              }}>
                ~{currentQuestion.suggestedDiscussionTime} min
              </span>
            )}
          </div>

          {/* Question Text */}
          <p style={{
            fontSize: '1.125rem',
            fontWeight: 500,
            lineHeight: 1.5,
            marginBottom: 'var(--spacing-md)'
          }}>
            {currentQuestion.question}
          </p>

          {/* Context */}
          {currentQuestion.context && (
            <div style={{
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--color-bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--spacing-md)',
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)'
            }}>
              {currentQuestion.context}
            </div>
          )}

          {/* Facilitator Notes */}
          {showFacilitatorNotes && (
            <>
              {currentQuestion.guidanceNotes && (
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'rgba(159, 122, 234, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--spacing-md)',
                  borderLeft: '3px solid #9f7aea'
                }}>
                  <div style={{
                    fontSize: '0.625rem',
                    color: '#9f7aea',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    Facilitation Guidance
                  </div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    margin: 0
                  }}>
                    {currentQuestion.guidanceNotes}
                  </p>
                </div>
              )}

              {currentQuestion.expectedThemes && currentQuestion.expectedThemes.length > 0 && (
                <div style={{
                  marginBottom: 'var(--spacing-md)'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    Expected Themes:
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                    {currentQuestion.expectedThemes.map((theme, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '2px 8px',
                          backgroundColor: 'var(--color-bg-tertiary)',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          color: 'var(--color-text-secondary)'
                        }}
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {currentQuestion.followUpQuestions && currentQuestion.followUpQuestions.length > 0 && (
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    Follow-up Questions:
                  </div>
                  <ul style={{
                    margin: 0,
                    paddingLeft: 'var(--spacing-lg)',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)'
                  }}>
                    {currentQuestion.followUpQuestions.map((fq, i) => (
                      <li key={i} style={{ marginBottom: '4px' }}>{fq}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Key Themes Capture (from discussion) */}
          {onAddKeyTheme && (
            <div style={{
              marginBottom: 'var(--spacing-md)',
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--color-bg-tertiary)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                Key Themes (captured during discussion):
              </div>
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-xs)',
                flexWrap: 'wrap',
                marginBottom: 'var(--spacing-sm)'
              }}>
                {currentDiscussionState?.keyThemes?.map((theme, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '2px 8px',
                      backgroundColor: 'var(--color-accent-primary)',
                      color: 'white',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {theme}
                    {onRemoveKeyTheme && (
                      <button
                        onClick={() => handleRemoveTheme(theme)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: '0.75rem',
                          opacity: 0.8
                        }}
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
                {(!currentDiscussionState?.keyThemes || currentDiscussionState.keyThemes.length === 0) && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    No themes captured yet
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                <input
                  type="text"
                  className="input"
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTheme()}
                  placeholder="Add theme..."
                  style={{ flex: 1, fontSize: '0.75rem', padding: '4px 8px' }}
                />
                <button
                  onClick={handleAddTheme}
                  disabled={!newTheme.trim()}
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Collected Responses */}
          {getResponsesForQuestion(currentQuestion.id).length > 0 && (
            <div style={{
              marginTop: 'var(--spacing-lg)',
              paddingTop: 'var(--spacing-lg)',
              borderTop: '1px solid var(--color-border)'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--spacing-sm)',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>Collected Responses ({getResponsesForQuestion(currentQuestion.id).length})</span>
                {currentDiscussionState?.highlightedResponseIds && currentDiscussionState.highlightedResponseIds.length > 0 && (
                  <span style={{ color: 'var(--color-severity-medium)' }}>
                    {currentDiscussionState.highlightedResponseIds.length} highlighted
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {getResponsesForQuestion(currentQuestion.id).map((response) => {
                  const isHighlighted = currentDiscussionState?.highlightedResponseIds?.includes(response.id) || false

                  return (
                    <div
                      key={response.id}
                      style={{
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        backgroundColor: isHighlighted
                          ? 'rgba(236, 201, 75, 0.15)'
                          : 'var(--color-bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        border: isHighlighted ? '1px solid var(--color-severity-medium)' : '1px solid transparent',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 'var(--spacing-sm)'
                      }}
                    >
                      {onHighlightResponse && (
                        <button
                          onClick={() => handleToggleHighlight(response.id, isHighlighted)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '2px',
                            fontSize: '1rem',
                            color: isHighlighted ? 'var(--color-severity-medium)' : 'var(--color-text-muted)',
                            flexShrink: 0
                          }}
                          title={isHighlighted ? 'Remove highlight' : 'Highlight response'}
                        >
                          {isHighlighted ? '★' : '☆'}
                        </button>
                      )}
                      <span style={{ flex: 1 }}>{response.textResponse}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Add Response */}
          <div style={{
            marginTop: 'var(--spacing-lg)',
            paddingTop: 'var(--spacing-lg)',
            borderTop: '1px solid var(--color-border)'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              Capture Response
            </div>
            <div className="flex gap-sm">
              <textarea
                className="input"
                rows={2}
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                placeholder="Enter a key point from the discussion..."
                style={{ resize: 'none' }}
              />
              <button
                className="btn btn-primary"
                disabled={!newResponse.trim()}
                onClick={() => {
                  if (newResponse.trim()) {
                    onAddResponse(currentQuestion.id, newResponse.trim())
                    setNewResponse('')
                  }
                }}
                style={{ alignSelf: 'flex-end' }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
