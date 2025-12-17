import type { BranchDecision } from '../../types/exercise.types'
import type { Module, Inject, BranchOption } from '../../types/scenario.types'

interface BranchHistoryProps {
  branchHistory: BranchDecision[]
  modules: Module[]
  allowBacktracking: boolean
  onRevert?: (index: number) => void
}

export default function BranchHistory({
  branchHistory,
  modules,
  allowBacktracking,
  onRevert
}: BranchHistoryProps) {
  // Helper to find inject by ID across all modules
  const findInject = (injectId: string): { inject: Inject; module: Module } | null => {
    for (const module of modules) {
      const inject = module.injects.find(i => i.id === injectId)
      if (inject) {
        return { inject, module }
      }
    }
    return null
  }

  // Helper to find branch option by ID
  const findBranchOption = (inject: Inject, branchOptionId: string): BranchOption | undefined => {
    return inject.branches?.find(b => b.id === branchOptionId)
  }

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (branchHistory.length === 0) {
    return (
      <div style={{
        padding: 'var(--spacing-md)',
        backgroundColor: 'var(--color-bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '1.5rem',
          marginBottom: 'var(--spacing-xs)'
        }}>
          ⑂
        </div>
        <div style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)'
        }}>
          No branch decisions yet
        </div>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          marginTop: 'var(--spacing-xs)'
        }}>
          Decisions will appear here as they are made
        </div>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: 'var(--color-bg-secondary)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: 'var(--spacing-sm) var(--spacing-md)',
        backgroundColor: 'var(--color-bg-tertiary)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div className="flex items-center gap-sm">
          <span style={{ fontSize: '1rem' }}>⑂</span>
          <span style={{
            fontWeight: 600,
            fontSize: '0.875rem',
            color: 'var(--color-text-primary)'
          }}>
            Branch History
          </span>
          <span style={{
            backgroundColor: 'var(--color-bg-elevated)',
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.625rem',
            color: 'var(--color-text-muted)'
          }}>
            {branchHistory.length} decision{branchHistory.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ padding: 'var(--spacing-md)' }}>
        {branchHistory.map((decision, index) => {
          const injectData = findInject(decision.injectId)
          const branchOption = injectData?.inject
            ? findBranchOption(injectData.inject, decision.branchOptionId)
            : undefined

          const isLast = index === branchHistory.length - 1

          return (
            <div
              key={`${decision.injectId}-${decision.decidedAt}`}
              style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                position: 'relative'
              }}
            >
              {/* Timeline line */}
              {!isLast && (
                <div style={{
                  position: 'absolute',
                  left: '11px',
                  top: '24px',
                  bottom: '0',
                  width: '2px',
                  backgroundColor: 'var(--color-border)'
                }} />
              )}

              {/* Timeline dot */}
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                zIndex: 1
              }}>
                <span style={{
                  color: 'white',
                  fontSize: '0.625rem',
                  fontWeight: 600
                }}>
                  {index + 1}
                </span>
              </div>

              {/* Content */}
              <div style={{
                flex: 1,
                paddingBottom: 'var(--spacing-md)',
                minWidth: 0
              }}>
                <div style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--spacing-sm)',
                  border: '1px solid var(--color-border)'
                }}>
                  {/* Decision point info */}
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    {injectData?.module.title} · {formatTime(decision.decidedAt)}
                  </div>

                  {/* Inject title */}
                  <div style={{
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    {injectData?.inject.title || 'Unknown Inject'}
                  </div>

                  {/* Selected branch */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-primary)'
                  }}>
                    <span style={{
                      color: 'var(--color-primary)',
                      fontSize: '0.75rem'
                    }}>
                      →
                    </span>
                    <span style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-primary)',
                      fontWeight: 500
                    }}>
                      {branchOption?.label || 'Unknown Option'}
                    </span>
                    {branchOption?.isDefault && (
                      <span style={{
                        fontSize: '0.625rem',
                        backgroundColor: 'var(--color-bg-elevated)',
                        padding: '1px 4px',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-text-muted)'
                      }}>
                        Default
                      </span>
                    )}
                  </div>

                  {/* Decided by */}
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginTop: 'var(--spacing-xs)'
                  }}>
                    Decided by: {decision.decidedBy === 'participant_vote'
                      ? 'Participant Vote'
                      : decision.decidedBy === 'automatic'
                        ? 'Automatic'
                        : 'Facilitator'}
                  </div>

                  {/* Revert button */}
                  {allowBacktracking && onRevert && (
                    <button
                      className="btn btn-ghost"
                      onClick={() => onRevert(index)}
                      style={{
                        marginTop: 'var(--spacing-sm)',
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        fontSize: '0.75rem',
                        color: 'var(--color-text-muted)'
                      }}
                    >
                      Revert to before this decision
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Path summary */}
      <div style={{
        padding: 'var(--spacing-sm) var(--spacing-md)',
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-tertiary)',
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)'
      }}>
        Path: {branchHistory.map((decision, index) => {
          const injectData = findInject(decision.injectId)
          const branchOption = injectData?.inject
            ? findBranchOption(injectData.inject, decision.branchOptionId)
            : undefined
          return (
            <span key={decision.branchOptionId}>
              {index > 0 && ' → '}
              <span style={{ color: 'var(--color-text-secondary)' }}>
                {branchOption?.label || '?'}
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
