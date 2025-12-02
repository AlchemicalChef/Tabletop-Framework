import type { Module } from '../../types/scenario.types'
import type { ExerciseProgress } from '../../types/exercise.types'

interface ProgressTrackerProps {
  modules: Module[]
  progress: ExerciseProgress
  onModuleClick: (moduleId: string) => void
  onInjectClick: (moduleId: string, injectId: string) => void
}

const PHASE_COLORS: Record<string, string> = {
  pre_incident: '#9f7aea',
  detection: '#4299e1',
  containment: '#ed8936',
  eradication: '#f56565',
  recovery: '#48bb78',
  post_incident: '#a0aec0'
}

export default function ProgressTracker({
  modules,
  progress,
  onModuleClick,
  onInjectClick
}: ProgressTrackerProps) {
  const totalInjects = modules.reduce((sum, m) => sum + m.injects.length, 0)
  const completedInjects = progress.completedInjectIds.length
  const percentComplete = totalInjects > 0 ? Math.round((completedInjects / totalInjects) * 100) : 0

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
          Exercise Progress
        </h3>
        <span style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)'
        }}>
          {completedInjects} / {totalInjects} injects ({percentComplete}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{
        height: '4px',
        backgroundColor: 'var(--color-bg-tertiary)'
      }}>
        <div style={{
          height: '100%',
          width: `${percentComplete}%`,
          backgroundColor: 'var(--color-accent-primary)',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Module List */}
      <div style={{ padding: 'var(--spacing-md)' }}>
        {modules.map((module, moduleIndex) => {
          const isCurrentModule = module.id === progress.currentModuleId
          const isCompletedModule = progress.completedModuleIds.includes(module.id)
          const phaseColor = PHASE_COLORS[module.phase] || '#a0aec0'

          return (
            <div
              key={module.id}
              style={{
                marginBottom: moduleIndex < modules.length - 1 ? 'var(--spacing-md)' : 0
              }}
            >
              {/* Module Header */}
              <div
                onClick={() => onModuleClick(module.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-sm)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  backgroundColor: isCurrentModule ? 'var(--color-bg-tertiary)' : 'transparent',
                  transition: 'background-color 0.15s'
                }}
              >
                {/* Status Icon */}
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  flexShrink: 0,
                  backgroundColor: isCompletedModule
                    ? 'var(--color-severity-low)'
                    : isCurrentModule
                      ? phaseColor
                      : 'var(--color-bg-tertiary)',
                  color: isCompletedModule || isCurrentModule
                    ? 'white'
                    : 'var(--color-text-muted)'
                }}>
                  {isCompletedModule ? '✓' : moduleIndex + 1}
                </div>

                {/* Module Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: isCurrentModule ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {module.title}
                  </div>
                  <div style={{
                    fontSize: '0.625rem',
                    color: 'var(--color-text-muted)'
                  }}>
                    {module.injects.length} injects
                  </div>
                </div>

                {/* Phase Badge */}
                <span style={{
                  fontSize: '0.5rem',
                  padding: '2px 4px',
                  borderRadius: '2px',
                  backgroundColor: `${phaseColor}20`,
                  color: phaseColor,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}>
                  {module.phase.replace('_', ' ')}
                </span>
              </div>

              {/* Inject Timeline (only show for current module) */}
              {isCurrentModule && module.injects.length > 0 && (
                <div style={{
                  marginLeft: '28px',
                  marginTop: 'var(--spacing-xs)',
                  paddingLeft: 'var(--spacing-sm)',
                  borderLeft: `2px solid ${phaseColor}40`
                }}>
                  {module.injects.map((inject, injectIndex) => {
                    const isCurrentInject = inject.id === progress.currentInjectId
                    const isCompletedInject = progress.completedInjectIds.includes(inject.id)

                    return (
                      <div
                        key={inject.id}
                        onClick={() => onInjectClick(module.id, inject.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-sm)',
                          padding: '4px var(--spacing-sm)',
                          marginBottom: '2px',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          backgroundColor: isCurrentInject ? `${phaseColor}15` : 'transparent'
                        }}
                      >
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: isCompletedInject
                            ? 'var(--color-severity-low)'
                            : isCurrentInject
                              ? phaseColor
                              : 'var(--color-bg-elevated)',
                          border: isCurrentInject && !isCompletedInject
                            ? `2px solid ${phaseColor}`
                            : 'none',
                          flexShrink: 0
                        }} />
                        <span style={{
                          fontSize: '0.75rem',
                          color: isCurrentInject
                            ? 'var(--color-text-primary)'
                            : isCompletedInject
                              ? 'var(--color-text-muted)'
                              : 'var(--color-text-secondary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {inject.title || `Inject ${injectIndex + 1}`}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
