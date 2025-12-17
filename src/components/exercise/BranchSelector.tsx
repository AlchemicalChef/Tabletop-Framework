import type { BranchOption, Inject } from '../../types/scenario.types'

interface BranchSelectorProps {
  inject: Inject
  branchOptions: BranchOption[]
  onSelectBranch: (branchId: string) => void
  onSkip: () => void
  showFacilitatorNotes: boolean
}

export default function BranchSelector({
  inject,
  branchOptions,
  onSelectBranch,
  onSkip,
  showFacilitatorNotes
}: BranchSelectorProps) {
  const defaultBranch = branchOptions.find(b => b.isDefault)

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-tertiary)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            marginBottom: 'var(--spacing-sm)'
          }}>
            <span style={{
              backgroundColor: 'var(--color-severity-high)',
              color: 'white',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              Decision Point
            </span>
          </div>
          <h3 style={{
            margin: 0,
            fontSize: '1.25rem',
            color: 'var(--color-text-primary)'
          }}>
            {inject.title}
          </h3>
          <p style={{
            margin: 'var(--spacing-sm) 0 0',
            color: 'var(--color-text-secondary)',
            fontSize: '0.875rem'
          }}>
            Choose how to proceed with the exercise
          </p>
        </div>

        {/* Branch Options */}
        <div style={{
          padding: 'var(--spacing-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md)'
        }}>
          {branchOptions.map(branch => (
            <button
              key={branch.id}
              onClick={() => onSelectBranch(branch.id)}
              style={{
                display: 'block',
                width: '100%',
                padding: 'var(--spacing-md)',
                backgroundColor: branch.isDefault
                  ? 'var(--color-bg-secondary)'
                  : 'var(--color-bg-primary)',
                border: branch.isDefault
                  ? '2px solid var(--color-primary)'
                  : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-bg-tertiary)'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-primary)'
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = branch.isDefault
                  ? 'var(--color-bg-secondary)'
                  : 'var(--color-bg-primary)'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = branch.isDefault
                  ? 'var(--color-primary)'
                  : 'var(--color-border)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--spacing-md)'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: branch.isDefault
                    ? 'var(--color-primary)'
                    : 'var(--color-bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <span style={{
                    color: branch.isDefault ? 'white' : 'var(--color-text-secondary)',
                    fontSize: '0.75rem'
                  }}>
                    {branch.isDefault ? '★' : '→'}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    <span style={{
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      fontSize: '1rem'
                    }}>
                      {branch.label}
                    </span>
                    {branch.isDefault && (
                      <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-primary)',
                        padding: '2px 6px',
                        backgroundColor: 'var(--color-bg-tertiary)',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        Default
                      </span>
                    )}
                  </div>
                  {branch.description && (
                    <p style={{
                      margin: 0,
                      color: 'var(--color-text-secondary)',
                      fontSize: '0.875rem',
                      lineHeight: 1.5
                    }}>
                      {branch.description}
                    </p>
                  )}
                  {showFacilitatorNotes && branch.facilitatorNotes && (
                    <div style={{
                      marginTop: 'var(--spacing-sm)',
                      padding: 'var(--spacing-sm)',
                      backgroundColor: 'var(--color-bg-tertiary)',
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: '3px solid var(--color-warning)'
                    }}>
                      <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-warning)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '4px'
                      }}>
                        Facilitator Notes
                      </span>
                      <span style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        fontStyle: 'italic'
                      }}>
                        {branch.facilitatorNotes}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: 'var(--spacing-lg)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--color-bg-secondary)'
        }}>
          <span style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)'
          }}>
            {branchOptions.length} option{branchOptions.length !== 1 ? 's' : ''} available
          </span>
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-sm)'
          }}>
            {defaultBranch && (
              <button
                className="btn btn-ghost"
                onClick={onSkip}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  fontSize: '0.875rem'
                }}
              >
                Skip (Use Default)
              </button>
            )}
            <button
              className="btn btn-ghost"
              onClick={onSkip}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)'
              }}
            >
              Continue Linearly
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
