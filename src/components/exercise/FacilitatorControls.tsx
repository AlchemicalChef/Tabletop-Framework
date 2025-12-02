import type { ExerciseStatus } from '../../types/exercise.types'

interface FacilitatorControlsProps {
  status: ExerciseStatus
  canAdvanceInject: boolean
  canAdvanceModule: boolean
  canGoBack: boolean
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onComplete: () => void
  onAdvanceInject: () => void
  onAdvanceModule: () => void
  onPreviousInject: () => void
}

export default function FacilitatorControls({
  status,
  canAdvanceInject,
  canAdvanceModule,
  canGoBack,
  onStart,
  onPause,
  onResume,
  onComplete,
  onAdvanceInject,
  onAdvanceModule,
  onPreviousInject
}: FacilitatorControlsProps) {
  const isActive = status === 'active'
  const isPaused = status === 'paused'
  const isDraft = status === 'draft'
  const isCompleted = status === 'completed'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-md)',
      padding: 'var(--spacing-md)',
      backgroundColor: 'var(--color-bg-tertiary)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)'
    }}>
      {/* Play/Pause Controls */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-sm)',
        paddingRight: 'var(--spacing-md)',
        borderRight: '1px solid var(--color-border)'
      }}>
        {isDraft && (
          <button
            className="btn btn-primary"
            onClick={onStart}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              fontSize: '1rem'
            }}
          >
            ▶ Start Exercise
          </button>
        )}

        {isActive && (
          <button
            className="btn btn-secondary"
            onClick={onPause}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              fontSize: '1rem'
            }}
          >
            ⏸ Pause
          </button>
        )}

        {isPaused && (
          <button
            className="btn btn-primary"
            onClick={onResume}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              fontSize: '1rem'
            }}
          >
            ▶ Resume
          </button>
        )}

        {(isActive || isPaused) && (
          <button
            className="btn btn-danger"
            onClick={onComplete}
            style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
          >
            End Exercise
          </button>
        )}
      </div>

      {/* Navigation Controls */}
      {!isDraft && !isCompleted && (
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          alignItems: 'center'
        }}>
          <button
            className="btn btn-ghost"
            onClick={onPreviousInject}
            disabled={!canGoBack}
            title="Previous Inject"
            style={{ padding: 'var(--spacing-sm)' }}
          >
            ← Back
          </button>

          <button
            className="btn btn-secondary"
            onClick={onAdvanceInject}
            disabled={!canAdvanceInject}
            style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
          >
            Next Inject →
          </button>

          <div style={{
            width: '1px',
            height: '24px',
            backgroundColor: 'var(--color-border)',
            margin: '0 var(--spacing-xs)'
          }} />

          <button
            className="btn btn-secondary"
            onClick={onAdvanceModule}
            disabled={!canAdvanceModule}
            style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
          >
            Next Module ⏭
          </button>
        </div>
      )}

      {/* Status Indicator */}
      <div style={{
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)'
      }}>
        <span style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: isActive
            ? 'var(--color-severity-high)'
            : isPaused
              ? 'var(--color-severity-medium)'
              : isCompleted
                ? 'var(--color-severity-low)'
                : 'var(--color-text-muted)'
        }} />
        <span style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
          textTransform: 'capitalize'
        }}>
          {status}
        </span>
      </div>
    </div>
  )
}
