import { useState } from 'react'
import type { DiscussionQuestion } from '../../types/scenario.types'
import type { ParticipantResponse } from '../../types/exercise.types'

interface DiscussionPanelProps {
  questions: DiscussionQuestion[]
  responses: ParticipantResponse[]
  currentQuestionIndex: number
  showFacilitatorNotes: boolean
  onQuestionSelect: (index: number) => void
  onAddResponse: (questionId: string, response: string) => void
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

export default function DiscussionPanel({
  questions,
  responses,
  currentQuestionIndex,
  showFacilitatorNotes,
  onQuestionSelect,
  onAddResponse
}: DiscussionPanelProps) {
  const [newResponse, setNewResponse] = useState('')
  const currentQuestion = questions[currentQuestionIndex]

  const getResponsesForQuestion = (questionId: string) => {
    return responses.filter(r => r.questionId === questionId)
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
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)'
        }}>
          {currentQuestionIndex + 1} of {questions.length}
        </span>
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
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: hasResponses ? categoryColor : 'var(--color-bg-elevated)'
              }} />
              Q{i + 1}
            </button>
          )
        })}
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <div style={{ padding: 'var(--spacing-lg)' }}>
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
                textTransform: 'uppercase'
              }}>
                Collected Responses ({getResponsesForQuestion(currentQuestion.id).length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {getResponsesForQuestion(currentQuestion.id).map((response) => (
                  <div
                    key={response.id}
                    style={{
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      backgroundColor: 'var(--color-bg-tertiary)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem'
                    }}
                  >
                    {response.textResponse}
                  </div>
                ))}
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
    </div>
  )
}
