import { useState } from 'react'
import type { Scenario } from '../../types/scenario.types'
import type { Exercise } from '../../types/exercise.types'
import { createParticipantPackage } from '../../utils/export'

interface ExportParticipantModalProps {
  scenario: Scenario
  exercise: Exercise | null
  onClose: () => void
}

interface Participant {
  id: string
  name: string
  role: string
}

export default function ExportParticipantModal({
  scenario,
  exercise,
  onClose
}: ExportParticipantModalProps) {
  const [participants, setParticipants] = useState<Participant[]>([
    { id: crypto.randomUUID(), name: '', role: '' }
  ])
  const [exportMode, setExportMode] = useState<'individual' | 'bulk'>('individual')
  const [isExporting, setIsExporting] = useState(false)
  const [exportResults, setExportResults] = useState<{ name: string; success: boolean; path?: string }[]>([])

  const addParticipant = () => {
    setParticipants([
      ...participants,
      { id: crypto.randomUUID(), name: '', role: '' }
    ])
  }

  const removeParticipant = (id: string) => {
    if (participants.length > 1) {
      setParticipants(participants.filter(p => p.id !== id))
    }
  }

  const updateParticipant = (id: string, field: 'name' | 'role', value: string) => {
    setParticipants(participants.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const handleExport = async () => {
    const validParticipants = participants.filter(p => p.name.trim())

    if (validParticipants.length === 0) {
      alert('Please add at least one participant with a name')
      return
    }

    setIsExporting(true)
    const results: { name: string; success: boolean; path?: string }[] = []

    for (const participant of validParticipants) {
      try {
        const { package: pkg, filename } = createParticipantPackage(
          scenario,
          exercise,
          participant.id,
          participant.name
        )

        const filePath = await window.electronAPI?.saveFileDialog({
          defaultPath: filename,
          filters: [{ name: 'CTEP Participant Package', extensions: ['ctep-participant.json'] }]
        })

        if (filePath) {
          const content = JSON.stringify(pkg, null, 2)
          const result = await window.electronAPI?.writeFile(filePath, content)

          if (result?.success) {
            results.push({ name: participant.name, success: true, path: filePath })
          } else {
            results.push({ name: participant.name, success: false })
          }
        } else {
          // User cancelled
          results.push({ name: participant.name, success: false })
        }
      } catch (error) {
        console.error('Export error:', error)
        results.push({ name: participant.name, success: false })
      }
    }

    setExportResults(results)
    setIsExporting(false)
  }

  const handleExportAll = async () => {
    const validParticipants = participants.filter(p => p.name.trim())

    if (validParticipants.length === 0) {
      alert('Please add at least one participant with a name')
      return
    }

    // For bulk export, we'd ideally select a folder
    // For now, we'll export one by one but with a streamlined flow
    await handleExport()
  }

  const successCount = exportResults.filter(r => r.success).length

  return (
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
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '600px',
          maxHeight: '80vh',
          overflow: 'auto',
          margin: 'var(--spacing-lg)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-lg)'
        }}>
          <h2 style={{ margin: 0 }}>Export Participant Packages</h2>
          <button className="btn btn-ghost" onClick={onClose}>×</button>
        </div>

        {exportResults.length > 0 ? (
          // Results view
          <div>
            <div style={{
              padding: 'var(--spacing-md)',
              backgroundColor: successCount > 0
                ? 'rgba(72, 187, 120, 0.1)'
                : 'rgba(245, 101, 101, 0.1)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--spacing-lg)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.5rem',
                marginBottom: 'var(--spacing-sm)'
              }}>
                {successCount > 0 ? '✓' : '×'}
              </div>
              <div style={{ fontWeight: 600 }}>
                {successCount} of {exportResults.length} packages exported
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              {exportResults.map((result, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-sm)',
                    backgroundColor: 'var(--color-bg-tertiary)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <span style={{
                    color: result.success
                      ? 'var(--color-severity-low)'
                      : 'var(--color-severity-high)'
                  }}>
                    {result.success ? '✓' : '×'}
                  </span>
                  <span>{result.name}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-sm" style={{ justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setExportResults([])}>
                Export More
              </button>
              <button className="btn btn-primary" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          // Input view
          <>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
              Create participant packages for each team member. These packages contain the scenario
              without facilitator notes, allowing participants to review and respond asynchronously.
            </p>

            <div style={{
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--color-bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                Scenario
              </div>
              <div style={{ fontWeight: 600 }}>{scenario.title}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                {scenario.modules.length} modules · {scenario.modules.reduce((sum, m) => sum + m.injects.length, 0)} injects
              </div>
            </div>

            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-md)'
              }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>
                  Participants
                </h3>
                <button className="btn btn-ghost" onClick={addParticipant}>
                  + Add Participant
                </button>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)'
              }}>
                {participants.map((participant, index) => (
                  <div
                    key={participant.id}
                    style={{
                      display: 'flex',
                      gap: 'var(--spacing-sm)',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{
                      width: '24px',
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)'
                    }}>
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      className="input"
                      value={participant.name}
                      onChange={e => updateParticipant(participant.id, 'name', e.target.value)}
                      placeholder="Participant name"
                      style={{ flex: 2 }}
                    />
                    <input
                      type="text"
                      className="input"
                      value={participant.role}
                      onChange={e => updateParticipant(participant.id, 'role', e.target.value)}
                      placeholder="Role (optional)"
                      style={{ flex: 1 }}
                    />
                    <button
                      className="btn btn-ghost"
                      onClick={() => removeParticipant(participant.id)}
                      disabled={participants.length === 1}
                      style={{ padding: 'var(--spacing-xs)' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              padding: 'var(--spacing-md)',
              backgroundColor: 'rgba(66, 153, 225, 0.1)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--spacing-lg)',
              fontSize: '0.875rem'
            }}>
              <strong>What's included in participant packages:</strong>
              <ul style={{
                margin: 'var(--spacing-sm) 0 0 var(--spacing-lg)',
                color: 'var(--color-text-secondary)'
              }}>
                <li>Scenario description and objectives</li>
                <li>All modules with injects and discussion questions</li>
                <li>Question response forms</li>
              </ul>
              <strong style={{ display: 'block', marginTop: 'var(--spacing-sm)' }}>
                What's NOT included:
              </strong>
              <ul style={{
                margin: 'var(--spacing-sm) 0 0 var(--spacing-lg)',
                color: 'var(--color-text-secondary)'
              }}>
                <li>Facilitator notes and guidance</li>
                <li>Expected actions and themes</li>
                <li>Follow-up questions</li>
              </ul>
            </div>

            <div className="flex gap-sm" style={{ justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleExport}
                disabled={isExporting || !participants.some(p => p.name.trim())}
              >
                {isExporting ? 'Exporting...' : 'Export Packages'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
