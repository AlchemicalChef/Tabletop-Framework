import { useState } from 'react'
import type { Inject, InjectType, Severity, Module, BranchOption } from '../../types/scenario.types'
import BranchEditor from './BranchEditor'

interface InjectEditorProps {
  inject: Inject
  index: number
  modules: Module[]
  currentModuleId: string
  onUpdate: (updates: Partial<Inject>) => void
  onDelete: () => void
}

const INJECT_TYPES: { value: InjectType; label: string; icon: string }[] = [
  { value: 'information', label: 'Information', icon: 'ℹ️' },
  { value: 'decision_point', label: 'Decision Point', icon: '🔀' },
  { value: 'escalation', label: 'Escalation', icon: '📈' },
  { value: 'communication', label: 'Communication', icon: '📧' },
  { value: 'resource', label: 'Resource', icon: '🔧' },
  { value: 'media', label: 'Media/PR', icon: '📰' },
  { value: 'regulatory', label: 'Regulatory', icon: '⚖️' },
  { value: 'technical', label: 'Technical', icon: '💻' }
]

const SEVERITY_OPTIONS: { value: Severity; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'var(--color-severity-low)' },
  { value: 'medium', label: 'Medium', color: 'var(--color-severity-medium)' },
  { value: 'high', label: 'High', color: 'var(--color-severity-high)' },
  { value: 'critical', label: 'Critical', color: 'var(--color-severity-critical)' }
]

export default function InjectEditor({ inject, index, modules, currentModuleId, onUpdate, onDelete }: InjectEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showBranchSection, setShowBranchSection] = useState(false)

  const hasBranches = inject.branches && inject.branches.length > 0

  const severityOption = SEVERITY_OPTIONS.find(s => s.value === inject.severity)
  const typeOption = INJECT_TYPES.find(t => t.value === inject.type)

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden'
      }}
    >
      {/* Inject Header */}
      <div
        style={{
          padding: 'var(--spacing-sm) var(--spacing-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          backgroundColor: isExpanded ? 'var(--color-bg-elevated)' : 'transparent'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-md">
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
            color: 'var(--color-text-muted)'
          }}>
            {index + 1}
          </span>
          <div>
            <div className="flex items-center gap-sm">
              <span style={{ fontSize: '0.875rem' }}>{typeOption?.icon}</span>
              <strong style={{ fontSize: '0.875rem' }}>
                {inject.title || 'Untitled Inject'}
              </strong>
              <span
                className="badge"
                style={{
                  backgroundColor: `${severityOption?.color}20`,
                  color: severityOption?.color,
                  fontSize: '0.625rem',
                  padding: '2px 6px'
                }}
              >
                {inject.severity}
              </span>
              {hasBranches && (
                <span
                  className="badge"
                  style={{
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    color: 'var(--color-primary)',
                    fontSize: '0.625rem',
                    padding: '2px 6px'
                  }}
                >
                  ⑂ {inject.branches?.length} branch{inject.branches?.length !== 1 ? 'es' : ''}
                </span>
              )}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              marginTop: '2px'
            }}>
              +{inject.triggerTime} min · {inject.source || 'No source'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-sm" onClick={e => e.stopPropagation()}>
          <span style={{
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)'
          }}>
            ▶
          </span>
        </div>
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
          {/* Title and Type Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-md)' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--color-text-secondary)'
              }}>
                Title
              </label>
              <input
                type="text"
                className="input"
                value={inject.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="Inject title..."
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--color-text-secondary)'
              }}>
                Type
              </label>
              <select
                className="input"
                value={inject.type}
                onChange={(e) => onUpdate({ type: e.target.value as InjectType })}
              >
                {INJECT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)'
            }}>
              Content
            </label>
            <textarea
              className="input"
              rows={4}
              value={inject.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Describe what happens in this inject. This is the narrative that drives decision-making..."
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          {/* Timing and Severity Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-md)' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--color-text-secondary)'
              }}>
                Trigger Time (min from module start)
              </label>
              <input
                type="number"
                className="input"
                value={inject.triggerTime}
                onChange={(e) => onUpdate({ triggerTime: parseInt(e.target.value) || 0 })}
                min={0}
                max={180}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--color-text-secondary)'
              }}>
                Severity
              </label>
              <select
                className="input"
                value={inject.severity}
                onChange={(e) => onUpdate({ severity: e.target.value as Severity })}
              >
                {SEVERITY_OPTIONS.map(sev => (
                  <option key={sev.value} value={sev.value}>
                    {sev.label}
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
                Source
              </label>
              <input
                type="text"
                className="input"
                value={inject.source || ''}
                onChange={(e) => onUpdate({ source: e.target.value })}
                placeholder="e.g., SOC Analyst, CEO, News Media"
              />
            </div>
          </div>

          {/* Expected Actions (Facilitator) */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)'
            }}>
              Expected Actions
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}> (facilitator only)</span>
            </label>
            <textarea
              className="input"
              rows={2}
              value={inject.expectedActions?.join('\n') || ''}
              onChange={(e) => onUpdate({
                expectedActions: e.target.value.split('\n').filter(a => a.trim())
              })}
              placeholder="What actions should participants consider? (one per line)"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Facilitator Notes */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)'
            }}>
              Facilitator Notes
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}> (not shown to participants)</span>
            </label>
            <textarea
              className="input"
              rows={2}
              value={inject.facilitatorNotes || ''}
              onChange={(e) => onUpdate({ facilitatorNotes: e.target.value })}
              placeholder="Additional guidance for the facilitator..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Branching Section */}
          <div style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: 'var(--spacing-md)'
          }}>
            <button
              className="btn btn-ghost"
              onClick={() => setShowBranchSection(!showBranchSection)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--spacing-sm)',
                backgroundColor: hasBranches
                  ? 'rgba(102, 126, 234, 0.1)'
                  : 'var(--color-bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
                border: hasBranches
                  ? '1px solid var(--color-primary)'
                  : '1px solid var(--color-border)'
              }}
            >
              <div className="flex items-center gap-sm">
                <span style={{ fontSize: '1rem' }}>⑂</span>
                <span style={{
                  fontWeight: 500,
                  color: hasBranches
                    ? 'var(--color-primary)'
                    : 'var(--color-text-secondary)'
                }}>
                  Branching / Decision Point
                </span>
                {hasBranches && (
                  <span style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.625rem',
                    fontWeight: 600
                  }}>
                    {inject.branches?.length} option{inject.branches?.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <span style={{
                transform: showBranchSection ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                fontSize: '0.625rem',
                color: 'var(--color-text-muted)'
              }}>
                ▶
              </span>
            </button>

            {showBranchSection && (
              <div style={{ marginTop: 'var(--spacing-md)' }}>
                <BranchEditor
                  branches={inject.branches || []}
                  modules={modules}
                  currentModuleId={currentModuleId}
                  currentInjectId={inject.id}
                  onUpdate={(branches: BranchOption[]) => onUpdate({ branches })}
                />
              </div>
            )}
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
              Delete Inject
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
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Delete Inject?</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
              This will permanently delete this inject. This action cannot be undone.
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
