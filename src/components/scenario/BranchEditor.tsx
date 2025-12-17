import { useState } from 'react'
import type { BranchOption, BranchTarget, Module, Inject, createEmptyBranchOption } from '../../types/scenario.types'

interface BranchEditorProps {
  branches: BranchOption[]
  modules: Module[]
  currentModuleId: string
  currentInjectId: string
  onUpdate: (branches: BranchOption[]) => void
}

const TARGET_TYPES: { value: BranchTarget['type']; label: string; description: string }[] = [
  { value: 'inject', label: 'Jump to Inject', description: 'Continue from a specific inject' },
  { value: 'module', label: 'Jump to Module', description: 'Skip to a different module' },
  { value: 'end_module', label: 'End Module', description: 'Finish current module early' },
  { value: 'end_scenario', label: 'End Scenario', description: 'Complete the exercise' },
  { value: 'insert_injects', label: 'Insert Content', description: 'Add dynamic injects then continue' }
]

export default function BranchEditor({
  branches,
  modules,
  currentModuleId,
  currentInjectId,
  onUpdate
}: BranchEditorProps) {
  const [expandedBranchId, setExpandedBranchId] = useState<string | null>(null)

  // Get all injects across all modules for target selection
  const allInjects = modules.flatMap(m =>
    m.injects.map(inj => ({
      ...inj,
      moduleId: m.id,
      moduleTitle: m.title
    }))
  )

  // Filter out current inject from target options
  const availableInjects = allInjects.filter(inj =>
    !(inj.moduleId === currentModuleId && inj.id === currentInjectId)
  )

  const addBranch = () => {
    const newBranch: BranchOption = {
      id: crypto.randomUUID(),
      label: 'New Branch Option',
      target: {
        type: 'inject'
      }
    }
    onUpdate([...branches, newBranch])
    setExpandedBranchId(newBranch.id)
  }

  const updateBranch = (branchId: string, updates: Partial<BranchOption>) => {
    onUpdate(branches.map(b =>
      b.id === branchId ? { ...b, ...updates } : b
    ))
  }

  const removeBranch = (branchId: string) => {
    onUpdate(branches.filter(b => b.id !== branchId))
    if (expandedBranchId === branchId) {
      setExpandedBranchId(null)
    }
  }

  const setDefaultBranch = (branchId: string) => {
    onUpdate(branches.map(b => ({
      ...b,
      isDefault: b.id === branchId ? !b.isDefault : false
    })))
  }

  const moveBranch = (branchId: string, direction: 'up' | 'down') => {
    const index = branches.findIndex(b => b.id === branchId)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === branches.length - 1)
    ) return

    const newBranches = [...branches]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[newBranches[index], newBranches[swapIndex]] = [newBranches[swapIndex], newBranches[index]]
    onUpdate(newBranches)
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
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
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
            color: 'var(--color-primary)'
          }}>
            Branch Options ({branches.length})
          </span>
        </div>
        <button
          className="btn btn-ghost"
          onClick={addBranch}
          style={{
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            fontSize: '0.75rem'
          }}
        >
          + Add Branch
        </button>
      </div>

      {/* Branch List */}
      {branches.length === 0 ? (
        <div style={{
          padding: 'var(--spacing-lg)',
          textAlign: 'center',
          color: 'var(--color-text-muted)'
        }}>
          <p style={{ marginBottom: 'var(--spacing-sm)' }}>
            No branches defined. Add branches to create decision points.
          </p>
          <button className="btn btn-secondary" onClick={addBranch}>
            + Add First Branch
          </button>
        </div>
      ) : (
        <div style={{ padding: 'var(--spacing-sm)' }}>
          {branches.map((branch, index) => (
            <BranchOptionEditor
              key={branch.id}
              branch={branch}
              index={index}
              totalBranches={branches.length}
              isExpanded={expandedBranchId === branch.id}
              modules={modules}
              availableInjects={availableInjects}
              currentModuleId={currentModuleId}
              onToggleExpand={() => setExpandedBranchId(
                expandedBranchId === branch.id ? null : branch.id
              )}
              onUpdate={(updates) => updateBranch(branch.id, updates)}
              onRemove={() => removeBranch(branch.id)}
              onSetDefault={() => setDefaultBranch(branch.id)}
              onMove={(dir) => moveBranch(branch.id, dir)}
            />
          ))}
        </div>
      )}

      {/* Help text */}
      {branches.length > 0 && (
        <div style={{
          padding: 'var(--spacing-sm) var(--spacing-md)',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-tertiary)',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)'
        }}>
          During exercise, facilitator will choose from these options when this inject is displayed.
          Mark one as default for the "continue normally" path.
        </div>
      )}
    </div>
  )
}

// ============================================
// BRANCH OPTION EDITOR SUBCOMPONENT
// ============================================

interface BranchOptionEditorProps {
  branch: BranchOption
  index: number
  totalBranches: number
  isExpanded: boolean
  modules: Module[]
  availableInjects: (Inject & { moduleId: string; moduleTitle: string })[]
  currentModuleId: string
  onToggleExpand: () => void
  onUpdate: (updates: Partial<BranchOption>) => void
  onRemove: () => void
  onSetDefault: () => void
  onMove: (direction: 'up' | 'down') => void
}

function BranchOptionEditor({
  branch,
  index,
  totalBranches,
  isExpanded,
  modules,
  availableInjects,
  currentModuleId,
  onToggleExpand,
  onUpdate,
  onRemove,
  onSetDefault,
  onMove
}: BranchOptionEditorProps) {
  const targetType = TARGET_TYPES.find(t => t.value === branch.target.type)

  const updateTarget = (updates: Partial<BranchTarget>) => {
    onUpdate({
      target: { ...branch.target, ...updates }
    })
  }

  // Get injects for the selected module (for target selection)
  const getInjectsForModule = (moduleId: string) => {
    return availableInjects.filter(inj => inj.moduleId === moduleId)
  }

  // Current module for target selector
  const targetModuleId = branch.target.moduleId || currentModuleId

  return (
    <div style={{
      backgroundColor: branch.isDefault
        ? 'rgba(102, 126, 234, 0.05)'
        : 'var(--color-bg-primary)',
      borderRadius: 'var(--radius-sm)',
      border: branch.isDefault
        ? '1px solid var(--color-primary)'
        : '1px solid var(--color-border)',
      marginBottom: 'var(--spacing-sm)',
      overflow: 'hidden'
    }}>
      {/* Collapsed Header */}
      <div
        style={{
          padding: 'var(--spacing-sm) var(--spacing-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          backgroundColor: isExpanded ? 'var(--color-bg-tertiary)' : 'transparent'
        }}
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-sm">
          <span style={{
            width: '20px',
            height: '20px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: branch.isDefault
              ? 'var(--color-primary)'
              : 'var(--color-bg-tertiary)',
            color: branch.isDefault ? 'white' : 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.625rem',
            fontWeight: 600
          }}>
            {branch.isDefault ? '★' : index + 1}
          </span>
          <div>
            <div style={{
              fontWeight: 500,
              fontSize: '0.875rem',
              color: 'var(--color-text-primary)'
            }}>
              {branch.label || 'Untitled Branch'}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)'
            }}>
              {targetType?.label} {branch.isDefault && '· Default'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-xs" onClick={e => e.stopPropagation()}>
          <button
            className="btn btn-ghost"
            onClick={() => onMove('up')}
            disabled={index === 0}
            style={{ padding: '4px', fontSize: '0.75rem' }}
            title="Move up"
          >
            ↑
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => onMove('down')}
            disabled={index === totalBranches - 1}
            style={{ padding: '4px', fontSize: '0.75rem' }}
            title="Move down"
          >
            ↓
          </button>
          <span style={{
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            fontSize: '0.625rem',
            color: 'var(--color-text-muted)',
            marginLeft: 'var(--spacing-xs)'
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
          {/* Label */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)'
            }}>
              Label
            </label>
            <input
              type="text"
              className="input"
              value={branch.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="e.g., Team decides to pay ransom"
            />
          </div>

          {/* Description */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)'
            }}>
              Description
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}> (optional)</span>
            </label>
            <textarea
              className="input"
              rows={2}
              value={branch.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Explain what this choice represents..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Target Type */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)'
            }}>
              Target Type
            </label>
            <select
              className="input"
              value={branch.target.type}
              onChange={(e) => updateTarget({
                type: e.target.value as BranchTarget['type'],
                injectId: undefined,
                moduleId: undefined,
                targetModuleId: undefined
              })}
            >
              {TARGET_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} - {type.description}
                </option>
              ))}
            </select>
          </div>

          {/* Target Selectors based on type */}
          {branch.target.type === 'inject' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-xs)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)'
                }}>
                  Module
                </label>
                <select
                  className="input"
                  value={branch.target.moduleId || currentModuleId}
                  onChange={(e) => updateTarget({
                    moduleId: e.target.value,
                    injectId: undefined
                  })}
                >
                  {modules.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.title} {m.id === currentModuleId && '(current)'}
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
                  Target Inject
                </label>
                <select
                  className="input"
                  value={branch.target.injectId || ''}
                  onChange={(e) => updateTarget({ injectId: e.target.value })}
                >
                  <option value="">Select inject...</option>
                  {getInjectsForModule(targetModuleId).map(inj => (
                    <option key={inj.id} value={inj.id}>
                      {inj.order + 1}. {inj.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {branch.target.type === 'module' && (
            <div>
              <label style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--color-text-secondary)'
              }}>
                Target Module
              </label>
              <select
                className="input"
                value={branch.target.targetModuleId || ''}
                onChange={(e) => updateTarget({ targetModuleId: e.target.value })}
              >
                <option value="">Select module...</option>
                {modules.filter(m => m.id !== currentModuleId).map(m => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {branch.target.type === 'insert_injects' && (
            <div style={{
              padding: 'var(--spacing-sm)',
              backgroundColor: 'var(--color-bg-tertiary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--color-border)'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                Dynamic inject insertion coming soon
              </div>
              <div className="flex items-center gap-xs">
                <input
                  type="checkbox"
                  checked={branch.target.continueAfterInsert ?? true}
                  onChange={(e) => updateTarget({ continueAfterInsert: e.target.checked })}
                  id={`continue-${branch.id}`}
                />
                <label
                  htmlFor={`continue-${branch.id}`}
                  style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}
                >
                  Continue to next inject after inserted content
                </label>
              </div>
            </div>
          )}

          {(branch.target.type === 'end_module' || branch.target.type === 'end_scenario') && (
            <div style={{
              padding: 'var(--spacing-sm)',
              backgroundColor: 'rgba(245, 101, 101, 0.1)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-severity-critical)',
              fontSize: '0.75rem',
              color: 'var(--color-text-secondary)'
            }}>
              {branch.target.type === 'end_module'
                ? 'This branch will end the current module and proceed to the next one.'
                : 'This branch will end the entire exercise.'}
            </div>
          )}

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
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}> (when to choose this)</span>
            </label>
            <textarea
              className="input"
              rows={2}
              value={branch.facilitatorNotes || ''}
              onChange={(e) => onUpdate({ facilitatorNotes: e.target.value })}
              placeholder="Guidance for the facilitator on when this branch is appropriate..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center" style={{
            paddingTop: 'var(--spacing-sm)',
            borderTop: '1px solid var(--color-border)'
          }}>
            <div className="flex items-center gap-sm">
              <button
                className={`btn ${branch.isDefault ? 'btn-primary' : 'btn-secondary'}`}
                onClick={onSetDefault}
                style={{ fontSize: '0.75rem', padding: 'var(--spacing-xs) var(--spacing-sm)' }}
              >
                {branch.isDefault ? '★ Default' : 'Set as Default'}
              </button>
            </div>
            <button
              className="btn btn-ghost"
              onClick={onRemove}
              style={{
                color: 'var(--color-accent-danger)',
                fontSize: '0.75rem',
                padding: 'var(--spacing-xs) var(--spacing-sm)'
              }}
            >
              Remove Branch
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
