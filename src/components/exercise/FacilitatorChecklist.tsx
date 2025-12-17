import { useState } from 'react'
import type { ExerciseChecklist, ChecklistItem } from '../../types/exercise.types'

interface FacilitatorChecklistProps {
  checklist: ExerciseChecklist
  onToggleItem: (phase: 'preExercise' | 'postExercise', itemId: string) => void
  onReset?: () => void
  exerciseStatus: 'draft' | 'active' | 'paused' | 'completed' | 'archived'
}

function ChecklistSection({
  title,
  items,
  phase,
  onToggleItem,
  isExpanded,
  onToggleExpand,
  accentColor
}: {
  title: string
  items: ChecklistItem[]
  phase: 'preExercise' | 'postExercise'
  onToggleItem: (phase: 'preExercise' | 'postExercise', itemId: string) => void
  isExpanded: boolean
  onToggleExpand: () => void
  accentColor: string
}) {
  const completedCount = items.filter(item => item.completed).length
  const totalCount = items.length
  const allComplete = completedCount === totalCount

  return (
    <div style={{
      backgroundColor: 'var(--color-bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)',
      overflow: 'hidden'
    }}>
      {/* Section Header */}
      <button
        onClick={onToggleExpand}
        style={{
          width: '100%',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          backgroundColor: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          borderBottom: isExpanded ? '1px solid var(--color-border)' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: allComplete ? 'var(--color-severity-low)' : accentColor
          }} />
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)'
          }}>
            {title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <span style={{
            fontSize: '0.625rem',
            color: allComplete ? 'var(--color-severity-low)' : 'var(--color-text-muted)',
            fontWeight: 500
          }}>
            {completedCount}/{totalCount}
          </span>
          <span style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            fontSize: '0.625rem',
            color: 'var(--color-text-muted)'
          }}>
            ▼
          </span>
        </div>
      </button>

      {/* Items */}
      {isExpanded && (
        <div style={{ padding: 'var(--spacing-sm)' }}>
          {items.map(item => (
            <label
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggleItem(phase, item.id)}
                style={{
                  marginTop: '2px',
                  accentColor: accentColor
                }}
              />
              <div style={{ flex: 1 }}>
                <span style={{
                  fontSize: '0.75rem',
                  color: item.completed ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                  textDecoration: item.completed ? 'line-through' : 'none'
                }}>
                  {item.label}
                </span>
                {item.completed && item.completedAt && (
                  <span style={{
                    display: 'block',
                    fontSize: '0.625rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '2px'
                  }}>
                    {new Date(item.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FacilitatorChecklist({
  checklist,
  onToggleItem,
  onReset,
  exerciseStatus
}: FacilitatorChecklistProps) {
  const [preExpanded, setPreExpanded] = useState(
    exerciseStatus === 'draft' || checklist.preExercise.some(i => !i.completed)
  )
  const [postExpanded, setPostExpanded] = useState(
    exerciseStatus === 'completed' || checklist.postExercise.some(i => i.completed)
  )
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const preCompleteCount = checklist.preExercise.filter(i => i.completed).length
  const postCompleteCount = checklist.postExercise.filter(i => i.completed).length
  const totalPre = checklist.preExercise.length
  const totalPost = checklist.postExercise.length

  const allPreComplete = preCompleteCount === totalPre
  const allPostComplete = postCompleteCount === totalPost

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-sm)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 'var(--spacing-xs)'
      }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)'
        }}>
          Facilitator Checklist
        </span>
        {onReset && (preCompleteCount > 0 || postCompleteCount > 0) && (
          <button
            onClick={() => setShowResetConfirm(true)}
            style={{
              fontSize: '0.625rem',
              color: 'var(--color-text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 4px'
            }}
          >
            Reset
          </button>
        )}
      </div>

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <div style={{
          padding: 'var(--spacing-sm)',
          backgroundColor: 'rgba(245, 101, 101, 0.1)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(245, 101, 101, 0.3)',
          fontSize: '0.75rem'
        }}>
          <p style={{ margin: '0 0 var(--spacing-xs) 0', color: 'var(--color-text-primary)' }}>
            Reset all checklist items?
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
            <button
              onClick={() => {
                onReset?.()
                setShowResetConfirm(false)
              }}
              className="btn btn-ghost"
              style={{
                padding: '4px 8px',
                fontSize: '0.625rem',
                color: 'var(--color-accent-danger)'
              }}
            >
              Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="btn btn-ghost"
              style={{ padding: '4px 8px', fontSize: '0.625rem' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Overall Progress */}
      <div style={{
        padding: 'var(--spacing-sm)',
        backgroundColor: 'var(--color-bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            height: '4px',
            backgroundColor: 'var(--color-bg-elevated)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            display: 'flex'
          }}>
            <div style={{
              width: `${(preCompleteCount / totalPre) * 50}%`,
              backgroundColor: allPreComplete ? 'var(--color-severity-low)' : 'var(--color-accent-primary)',
              transition: 'width 0.3s'
            }} />
            <div style={{
              width: `${(postCompleteCount / totalPost) * 50}%`,
              backgroundColor: allPostComplete ? 'var(--color-severity-low)' : 'var(--color-severity-medium)',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
        <span style={{
          fontSize: '0.625rem',
          color: 'var(--color-text-muted)',
          whiteSpace: 'nowrap'
        }}>
          {preCompleteCount + postCompleteCount}/{totalPre + totalPost}
        </span>
      </div>

      {/* Pre-Exercise Checklist */}
      <ChecklistSection
        title="Pre-Exercise"
        items={checklist.preExercise}
        phase="preExercise"
        onToggleItem={onToggleItem}
        isExpanded={preExpanded}
        onToggleExpand={() => setPreExpanded(!preExpanded)}
        accentColor="var(--color-accent-primary)"
      />

      {/* Post-Exercise Checklist */}
      <ChecklistSection
        title="Post-Exercise"
        items={checklist.postExercise}
        phase="postExercise"
        onToggleItem={onToggleItem}
        isExpanded={postExpanded}
        onToggleExpand={() => setPostExpanded(!postExpanded)}
        accentColor="var(--color-severity-medium)"
      />

      {/* Quick Tips based on status */}
      {exerciseStatus === 'draft' && !allPreComplete && (
        <div style={{
          padding: 'var(--spacing-sm)',
          backgroundColor: 'rgba(66, 153, 225, 0.1)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.625rem',
          color: 'var(--color-accent-primary)'
        }}>
          Complete the pre-exercise checklist before starting
        </div>
      )}

      {exerciseStatus === 'completed' && !allPostComplete && (
        <div style={{
          padding: 'var(--spacing-sm)',
          backgroundColor: 'rgba(237, 137, 54, 0.1)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.625rem',
          color: 'var(--color-severity-medium)'
        }}>
          Don't forget to complete the post-exercise checklist
        </div>
      )}

      {allPreComplete && allPostComplete && (
        <div style={{
          padding: 'var(--spacing-sm)',
          backgroundColor: 'rgba(72, 187, 120, 0.1)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.625rem',
          color: 'var(--color-severity-low)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)'
        }}>
          <span>✓</span> All checklist items complete
        </div>
      )}
    </div>
  )
}
