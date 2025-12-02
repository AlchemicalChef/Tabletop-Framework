import { useState } from 'react'
import type { DiscussionQuestion, QuestionCategory, ResponseType } from '../../types/scenario.types'

interface QuestionEditorProps {
  question: DiscussionQuestion
  index: number
  onUpdate: (updates: Partial<DiscussionQuestion>) => void
  onDelete: () => void
}

const QUESTION_CATEGORIES: { value: QuestionCategory; label: string; icon: string }[] = [
  { value: 'decision', label: 'Decision', icon: '🎯' },
  { value: 'coordination', label: 'Coordination', icon: '🤝' },
  { value: 'communication', label: 'Communication', icon: '📣' },
  { value: 'technical', label: 'Technical', icon: '🔧' },
  { value: 'policy', label: 'Policy', icon: '📋' },
  { value: 'resource', label: 'Resource', icon: '📦' },
  { value: 'lessons_learned', label: 'Lessons Learned', icon: '📚' }
]

const RESPONSE_TYPES: { value: ResponseType; label: string; description: string }[] = [
  { value: 'text', label: 'Free Text', description: 'Open-ended response' },
  { value: 'multiple_choice', label: 'Multiple Choice', description: 'Select from options' },
  { value: 'rating', label: 'Rating Scale', description: '1-5 or 1-10 scale' }
]

const CATEGORY_COLORS: Record<QuestionCategory, string> = {
  decision: '#f56565',
  coordination: '#4299e1',
  communication: '#48bb78',
  technical: '#ed8936',
  policy: '#9f7aea',
  resource: '#ecc94b',
  lessons_learned: '#a0aec0'
}

export default function QuestionEditor({ question, index, onUpdate, onDelete }: QuestionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const categoryOption = QUESTION_CATEGORIES.find(c => c.value === question.category)
  const categoryColor = CATEGORY_COLORS[question.category]

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden'
      }}
    >
      {/* Question Header */}
      <div
        style={{
          padding: 'var(--spacing-sm) var(--spacing-md)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          cursor: 'pointer',
          backgroundColor: isExpanded ? 'var(--color-bg-elevated)' : 'transparent',
          gap: 'var(--spacing-md)'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-md" style={{ flex: 1 }}>
          <span style={{
            width: '24px',
            height: '24px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            flexShrink: 0,
            marginTop: '2px'
          }}>
            Q{index + 1}
          </span>
          <div style={{ flex: 1 }}>
            <div className="flex items-center gap-sm" style={{ marginBottom: '4px' }}>
              <span
                className="badge"
                style={{
                  backgroundColor: `${categoryColor}20`,
                  color: categoryColor,
                  fontSize: '0.625rem',
                  padding: '2px 6px'
                }}
              >
                {categoryOption?.icon} {question.category.replace('_', ' ')}
              </span>
              <span style={{
                fontSize: '0.625rem',
                color: 'var(--color-text-muted)'
              }}>
                {RESPONSE_TYPES.find(r => r.value === question.responseType)?.label}
              </span>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: question.question ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              margin: 0,
              lineHeight: 1.4
            }}>
              {question.question || 'No question text...'}
            </p>
          </div>
        </div>

        <span style={{
          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          flexShrink: 0,
          marginTop: '4px'
        }}>
          ▶
        </span>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{
          padding: 'var(--spacing-md)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md)'
        }}>
          {/* Question Text */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)'
            }}>
              Question
            </label>
            <textarea
              className="input"
              rows={2}
              value={question.question}
              onChange={(e) => onUpdate({ question: e.target.value })}
              placeholder="What question should participants discuss?"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Category and Response Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--color-text-secondary)'
              }}>
                Category
              </label>
              <select
                className="input"
                value={question.category}
                onChange={(e) => onUpdate({ category: e.target.value as QuestionCategory })}
              >
                {QUESTION_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--color-text-secondary)'
              }}>
                Response Type
              </label>
              <select
                className="input"
                value={question.responseType}
                onChange={(e) => onUpdate({ responseType: e.target.value as ResponseType })}
              >
                {RESPONSE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Multiple Choice Options (if applicable) */}
          {question.responseType === 'multiple_choice' && (
            <div>
              <label style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--color-text-secondary)'
              }}>
                Response Options
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                {(question.responseOptions || []).map((option, optIndex) => (
                  <div key={option.id} className="flex gap-sm">
                    <input
                      type="text"
                      className="input"
                      value={option.label}
                      onChange={(e) => {
                        const newOptions = [...(question.responseOptions || [])]
                        newOptions[optIndex] = { ...option, label: e.target.value, value: e.target.value }
                        onUpdate({ responseOptions: newOptions })
                      }}
                      placeholder={`Option ${optIndex + 1}`}
                    />
                    <button
                      className="btn btn-ghost"
                      onClick={() => {
                        const newOptions = (question.responseOptions || []).filter((_, i) => i !== optIndex)
                        onUpdate({ responseOptions: newOptions })
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  className="btn btn-secondary"
                  style={{ alignSelf: 'flex-start' }}
                  onClick={() => {
                    const newOption = {
                      id: crypto.randomUUID(),
                      label: '',
                      value: ''
                    }
                    onUpdate({ responseOptions: [...(question.responseOptions || []), newOption] })
                  }}
                >
                  + Add Option
                </button>
              </div>
            </div>
          )}

          {/* Context */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)'
            }}>
              Context
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}> (optional)</span>
            </label>
            <textarea
              className="input"
              rows={2}
              value={question.context || ''}
              onChange={(e) => onUpdate({ context: e.target.value })}
              placeholder="Additional context to help frame the question..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Facilitation Guidance */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)'
            }}>
              Facilitation Guidance
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}> (facilitator only)</span>
            </label>
            <textarea
              className="input"
              rows={2}
              value={question.guidanceNotes || ''}
              onChange={(e) => onUpdate({ guidanceNotes: e.target.value })}
              placeholder="Tips for the facilitator on leading this discussion..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Expected Themes */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)'
            }}>
              Expected Themes
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}> (facilitator only)</span>
            </label>
            <textarea
              className="input"
              rows={2}
              value={question.expectedThemes?.join('\n') || ''}
              onChange={(e) => onUpdate({
                expectedThemes: e.target.value.split('\n').filter(t => t.trim())
              })}
              placeholder="Key themes to look for in responses (one per line)..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Follow-up Questions */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)'
            }}>
              Follow-up Questions
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}> (facilitator only)</span>
            </label>
            <textarea
              className="input"
              rows={2}
              value={question.followUpQuestions?.join('\n') || ''}
              onChange={(e) => onUpdate({
                followUpQuestions: e.target.value.split('\n').filter(q => q.trim())
              })}
              placeholder="Potential follow-up questions (one per line)..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Discussion Time */}
          <div style={{ maxWidth: '200px' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)'
            }}>
              Suggested Discussion Time (min)
            </label>
            <input
              type="number"
              className="input"
              value={question.suggestedDiscussionTime || ''}
              onChange={(e) => onUpdate({
                suggestedDiscussionTime: parseInt(e.target.value) || undefined
              })}
              min={1}
              max={60}
              placeholder="5"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center" style={{
            paddingTop: 'var(--spacing-md)',
            borderTop: '1px solid var(--color-border)'
          }}>
            <button
              className="btn btn-ghost"
              style={{ color: 'var(--color-accent-danger)' }}
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Question
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setIsExpanded(false)}
            >
              Collapse
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="card"
            style={{ maxWidth: '400px', margin: 'var(--spacing-lg)' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Delete Question?</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
              This will permanently delete this discussion question. This action cannot be undone.
            </p>
            <div className="flex gap-sm" style={{ justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => {
                onDelete()
                setShowDeleteConfirm(false)
              }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
