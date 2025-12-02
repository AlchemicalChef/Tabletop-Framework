import type { Inject, Severity } from '../../types/scenario.types'

interface InjectDisplayProps {
  inject: Inject | null
  moduleTitle: string
  injectNumber: number
  totalInjects: number
  showFacilitatorNotes: boolean
  onAcknowledge?: () => void
  isAcknowledged?: boolean
}

const SEVERITY_COLORS: Record<Severity, { bg: string; text: string; label: string }> = {
  low: { bg: 'rgba(72, 187, 120, 0.15)', text: 'var(--color-severity-low)', label: 'LOW' },
  medium: { bg: 'rgba(236, 201, 75, 0.15)', text: 'var(--color-severity-medium)', label: 'MEDIUM' },
  high: { bg: 'rgba(237, 137, 54, 0.15)', text: 'var(--color-severity-high)', label: 'HIGH' },
  critical: { bg: 'rgba(245, 101, 101, 0.15)', text: 'var(--color-severity-critical)', label: 'CRITICAL' }
}

const INJECT_TYPE_LABELS: Record<string, { icon: string; label: string }> = {
  information: { icon: 'ℹ️', label: 'Information' },
  decision_point: { icon: '🔀', label: 'Decision Point' },
  escalation: { icon: '📈', label: 'Escalation' },
  communication: { icon: '📧', label: 'Communication Required' },
  resource: { icon: '🔧', label: 'Resource Update' },
  media: { icon: '📰', label: 'Media/PR' },
  regulatory: { icon: '⚖️', label: 'Regulatory' },
  technical: { icon: '💻', label: 'Technical' }
}

export default function InjectDisplay({
  inject,
  moduleTitle,
  injectNumber,
  totalInjects,
  showFacilitatorNotes,
  onAcknowledge,
  isAcknowledged
}: InjectDisplayProps) {
  if (!inject) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-2xl)',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-bg-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          marginBottom: 'var(--spacing-md)'
        }}>
          📋
        </div>
        <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>No Active Inject</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Start the exercise or advance to the next inject to begin.
        </p>
      </div>
    )
  }

  const severity = SEVERITY_COLORS[inject.severity]
  const typeInfo = INJECT_TYPE_LABELS[inject.type] || { icon: '📄', label: inject.type }

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
        backgroundColor: severity.bg,
        borderBottom: `2px solid ${severity.text}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div className="flex items-center gap-md">
          <span style={{
            fontSize: '1.5rem'
          }}>
            {typeInfo.icon}
          </span>
          <div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              marginBottom: '2px'
            }}>
              {moduleTitle} · Inject {injectNumber} of {totalInjects}
            </div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              margin: 0
            }}>
              {inject.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-sm">
          <span style={{
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            backgroundColor: severity.bg,
            color: severity.text,
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: 600,
            border: `1px solid ${severity.text}`
          }}>
            {severity.label}
          </span>
          <span style={{
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            backgroundColor: 'var(--color-bg-tertiary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            color: 'var(--color-text-secondary)'
          }}>
            {typeInfo.label}
          </span>
        </div>
      </div>

      {/* Source */}
      {inject.source && (
        <div style={{
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          backgroundColor: 'var(--color-bg-tertiary)',
          borderBottom: '1px solid var(--color-border)',
          fontSize: '0.875rem'
        }}>
          <strong>From:</strong> {inject.source}
        </div>
      )}

      {/* Content */}
      <div style={{
        padding: 'var(--spacing-lg)',
        fontSize: '1rem',
        lineHeight: 1.7
      }}>
        {inject.content.split('\n').map((paragraph, i) => (
          <p key={i} style={{ marginBottom: 'var(--spacing-md)' }}>
            {paragraph}
          </p>
        ))}
      </div>

      {/* Attachments */}
      {inject.attachments.length > 0 && (
        <div style={{
          padding: 'var(--spacing-md) var(--spacing-lg)',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-tertiary)'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--spacing-sm)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Attachments
          </div>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
            {inject.attachments.map(att => (
              <div
                key={att.id}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  backgroundColor: 'var(--color-bg-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                📎 {att.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Facilitator Notes */}
      {showFacilitatorNotes && (inject.facilitatorNotes || inject.expectedActions?.length) && (
        <div style={{
          padding: 'var(--spacing-md) var(--spacing-lg)',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'rgba(159, 122, 234, 0.1)'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#9f7aea',
            marginBottom: 'var(--spacing-sm)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 600
          }}>
            Facilitator Notes
          </div>

          {inject.expectedActions && inject.expectedActions.length > 0 && (
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                marginBottom: 'var(--spacing-xs)'
              }}>
                Expected Actions:
              </div>
              <ul style={{
                margin: 0,
                paddingLeft: 'var(--spacing-lg)',
                color: 'var(--color-text-secondary)',
                fontSize: '0.875rem'
              }}>
                {inject.expectedActions.map((action, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{action}</li>
                ))}
              </ul>
            </div>
          )}

          {inject.facilitatorNotes && (
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              margin: 0
            }}>
              {inject.facilitatorNotes}
            </p>
          )}
        </div>
      )}

      {/* Acknowledge Button */}
      {onAcknowledge && (
        <div style={{
          padding: 'var(--spacing-md) var(--spacing-lg)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            className={`btn ${isAcknowledged ? 'btn-ghost' : 'btn-primary'}`}
            onClick={onAcknowledge}
            disabled={isAcknowledged}
          >
            {isAcknowledged ? '✓ Acknowledged' : 'Acknowledge Inject'}
          </button>
        </div>
      )}
    </div>
  )
}
