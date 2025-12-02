import { useState } from 'react'
import type { Module, ModulePhase } from '../../types/scenario.types'
import InjectEditor from './InjectEditor'
import QuestionEditor from './QuestionEditor'

interface ModuleEditorProps {
  module: Module
  isExpanded: boolean
  onToggleExpand: () => void
  onUpdate: (updates: Partial<Module>) => void
  onDelete: () => void
  onAddInject: () => void
  onUpdateInject: (injectId: string, updates: any) => void
  onDeleteInject: (injectId: string) => void
  onAddQuestion: () => void
  onUpdateQuestion: (questionId: string, updates: any) => void
  onDeleteQuestion: (questionId: string) => void
}

const PHASE_OPTIONS: { value: ModulePhase; label: string; description: string }[] = [
  { value: 'pre_incident', label: 'Pre-Incident', description: 'Intelligence sharing and preparation' },
  { value: 'detection', label: 'Detection', description: 'Initial detection and analysis' },
  { value: 'containment', label: 'Containment', description: 'Immediate containment actions' },
  { value: 'eradication', label: 'Eradication', description: 'Threat removal' },
  { value: 'recovery', label: 'Recovery', description: 'System restoration' },
  { value: 'post_incident', label: 'Post-Incident', description: 'Lessons learned and reporting' }
]

const PHASE_COLORS: Record<ModulePhase, string> = {
  pre_incident: '#9f7aea',
  detection: '#4299e1',
  containment: '#ed8936',
  eradication: '#f56565',
  recovery: '#48bb78',
  post_incident: '#a0aec0'
}

export default function ModuleEditor({
  module,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
  onAddInject,
  onUpdateInject,
  onDeleteInject,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion
}: ModuleEditorProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'injects' | 'questions'>('injects')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const phaseColor = PHASE_COLORS[module.phase]

  return (
    <div
      className="card"
      style={{
        borderLeft: `4px solid ${phaseColor}`,
        padding: 0,
        overflow: 'hidden'
      }}
    >
      {/* Module Header */}
      <div
        style={{
          padding: 'var(--spacing-md) var(--spacing-lg)',
          backgroundColor: 'var(--color-bg-tertiary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-md">
          <span style={{
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)'
          }}>
            ▶
          </span>
          <div>
            <div className="flex items-center gap-sm">
              <span
                className="badge"
                style={{
                  backgroundColor: `${phaseColor}20`,
                  color: phaseColor,
                  textTransform: 'capitalize'
                }}
              >
                {module.phase.replace('_', ' ')}
              </span>
              <strong style={{ fontSize: '1rem' }}>{module.title || 'Untitled Module'}</strong>
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              marginTop: '2px'
            }}>
              {module.injects.length} inject{module.injects.length !== 1 ? 's' : ''} · {module.discussionQuestions.length} question{module.discussionQuestions.length !== 1 ? 's' : ''} · {module.suggestedDuration} min
            </div>
          </div>
        </div>

        <div className="flex items-center gap-sm" onClick={e => e.stopPropagation()}>
          <button
            className="btn btn-ghost"
            style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{ padding: 'var(--spacing-lg)' }}>
          {/* Tabs */}
          <div className="nav-tabs" style={{ marginBottom: 'var(--spacing-lg)', display: 'inline-flex' }}>
            <button
              className={`nav-tab ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`nav-tab ${activeTab === 'injects' ? 'active' : ''}`}
              onClick={() => setActiveTab('injects')}
            >
              Injects ({module.injects.length})
            </button>
            <button
              className={`nav-tab ${activeTab === 'questions' ? 'active' : ''}`}
              onClick={() => setActiveTab('questions')}
            >
              Questions ({module.discussionQuestions.length})
            </button>
          </div>

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-xs)',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  Module Title
                </label>
                <input
                  type="text"
                  className="input"
                  value={module.title}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  placeholder="Enter module title..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--spacing-xs)',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}>
                    Phase
                  </label>
                  <select
                    className="input"
                    value={module.phase}
                    onChange={(e) => onUpdate({ phase: e.target.value as ModulePhase })}
                  >
                    {PHASE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginTop: 'var(--spacing-xs)'
                  }}>
                    {PHASE_OPTIONS.find(o => o.value === module.phase)?.description}
                  </p>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--spacing-xs)',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}>
                    Suggested Duration (minutes)
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={module.suggestedDuration}
                    onChange={(e) => onUpdate({ suggestedDuration: parseInt(e.target.value) || 30 })}
                    min={5}
                    max={180}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-xs)',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  Description
                </label>
                <textarea
                  className="input"
                  rows={3}
                  value={module.description}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  placeholder="Describe what happens in this phase..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-xs)',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  Facilitator Notes
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}> (not shown to participants)</span>
                </label>
                <textarea
                  className="input"
                  rows={3}
                  value={module.facilitatorNotes || ''}
                  onChange={(e) => onUpdate({ facilitatorNotes: e.target.value })}
                  placeholder="Notes for the facilitator..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-xs)',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  Transition Guidance
                </label>
                <textarea
                  className="input"
                  rows={2}
                  value={module.transitionGuidance || ''}
                  onChange={(e) => onUpdate({ transitionGuidance: e.target.value })}
                  placeholder="How to transition to the next module..."
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          )}

          {/* Injects Tab */}
          {activeTab === 'injects' && (
            <div>
              {module.injects.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-xl)',
                  backgroundColor: 'var(--color-bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--color-border)'
                }}>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                    No injects yet. Injects are timed events that drive the exercise forward.
                  </p>
                  <button className="btn btn-primary" onClick={onAddInject}>
                    + Add First Inject
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  {module.injects
                    .sort((a, b) => a.order - b.order)
                    .map((inject, index) => (
                      <InjectEditor
                        key={inject.id}
                        inject={inject}
                        index={index}
                        onUpdate={(updates) => onUpdateInject(inject.id, updates)}
                        onDelete={() => onDeleteInject(inject.id)}
                      />
                    ))}
                  <button
                    className="btn btn-secondary"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={onAddInject}
                  >
                    + Add Inject
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div>
              {module.discussionQuestions.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-xl)',
                  backgroundColor: 'var(--color-bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--color-border)'
                }}>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                    No discussion questions yet. Add questions to facilitate team conversations.
                  </p>
                  <button className="btn btn-primary" onClick={onAddQuestion}>
                    + Add First Question
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  {module.discussionQuestions
                    .sort((a, b) => a.order - b.order)
                    .map((question, index) => (
                      <QuestionEditor
                        key={question.id}
                        question={question}
                        index={index}
                        onUpdate={(updates) => onUpdateQuestion(question.id, updates)}
                        onDelete={() => onDeleteQuestion(question.id)}
                      />
                    ))}
                  <button
                    className="btn btn-secondary"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={onAddQuestion}
                  >
                    + Add Question
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Delete Module?</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
              This will permanently delete "{module.title || 'Untitled Module'}" and all its injects and questions.
              This action cannot be undone.
            </p>
            <div className="flex gap-sm" style={{ justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => {
                onDelete()
                setShowDeleteConfirm(false)
              }}>
                Delete Module
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
