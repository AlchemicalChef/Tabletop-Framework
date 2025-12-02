import { useState } from 'react'
import type { ParticipantResponse } from '../../types/exercise.types'
import { validateResponsePackage } from '../../utils/export'

interface ImportResponsesModalProps {
  exerciseId: string
  onImport: (responses: ParticipantResponse[]) => void
  onClose: () => void
}

interface ImportedFile {
  filename: string
  participantName: string
  responseCount: number
  responses: ParticipantResponse[]
  valid: boolean
  error?: string
}

export default function ImportResponsesModal({
  exerciseId,
  onImport,
  onClose
}: ImportResponsesModalProps) {
  const [importedFiles, setImportedFiles] = useState<ImportedFile[]>([])
  const [isImporting, setIsImporting] = useState(false)

  const handleAddFiles = async () => {
    const filePath = await window.electronAPI?.openFileDialog({
      filters: [
        { name: 'CTEP Response Files', extensions: ['ctep-response.json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (!filePath) return

    setIsImporting(true)

    try {
      const result = await window.electronAPI?.readFile(filePath)

      if (!result?.success || !result.data) {
        setImportedFiles(prev => [...prev, {
          filename: filePath.split(/[/\\]/).pop() || 'unknown',
          participantName: 'Unknown',
          responseCount: 0,
          responses: [],
          valid: false,
          error: 'Failed to read file'
        }])
        return
      }

      const parsed = JSON.parse(result.data)
      const validation = validateResponsePackage(parsed)

      if (!validation.valid) {
        setImportedFiles(prev => [...prev, {
          filename: filePath.split(/[/\\]/).pop() || 'unknown',
          participantName: 'Unknown',
          responseCount: 0,
          responses: [],
          valid: false,
          error: validation.error
        }])
        return
      }

      const pkg = validation.package!

      // Check if this is for the right exercise
      if (pkg.exerciseId !== exerciseId) {
        setImportedFiles(prev => [...prev, {
          filename: filePath.split(/[/\\]/).pop() || 'unknown',
          participantName: pkg.participantName,
          responseCount: pkg.responses.length,
          responses: pkg.responses,
          valid: false,
          error: 'Response is for a different exercise'
        }])
        return
      }

      // Check for duplicates
      const isDuplicate = importedFiles.some(f =>
        f.participantName === pkg.participantName && f.valid
      )

      if (isDuplicate) {
        setImportedFiles(prev => [...prev, {
          filename: filePath.split(/[/\\]/).pop() || 'unknown',
          participantName: pkg.participantName,
          responseCount: pkg.responses.length,
          responses: pkg.responses,
          valid: false,
          error: 'Duplicate: responses from this participant already imported'
        }])
        return
      }

      setImportedFiles(prev => [...prev, {
        filename: filePath.split(/[/\\]/).pop() || 'unknown',
        participantName: pkg.participantName,
        responseCount: pkg.responses.length,
        responses: pkg.responses,
        valid: true
      }])
    } catch (error) {
      setImportedFiles(prev => [...prev, {
        filename: filePath.split(/[/\\]/).pop() || 'unknown',
        participantName: 'Unknown',
        responseCount: 0,
        responses: [],
        valid: false,
        error: 'Failed to parse file'
      }])
    } finally {
      setIsImporting(false)
    }
  }

  const handleRemoveFile = (index: number) => {
    setImportedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleImportAll = () => {
    const validResponses = importedFiles
      .filter(f => f.valid)
      .flatMap(f => f.responses)

    onImport(validResponses)
    onClose()
  }

  const validCount = importedFiles.filter(f => f.valid).length
  const totalResponses = importedFiles
    .filter(f => f.valid)
    .reduce((sum, f) => sum + f.responseCount, 0)

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
          <h2 style={{ margin: 0 }}>Import Participant Responses</h2>
          <button className="btn btn-ghost" onClick={onClose}>×</button>
        </div>

        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
          Import response files (.ctep-response.json) collected from participants.
          Responses will be merged with existing exercise data.
        </p>

        {/* Import Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'var(--spacing-lg)'
        }}>
          <button
            className="btn btn-secondary"
            onClick={handleAddFiles}
            disabled={isImporting}
            style={{ width: '200px' }}
          >
            {isImporting ? 'Reading...' : '+ Add Response File'}
          </button>
        </div>

        {/* Imported Files List */}
        {importedFiles.length > 0 && (
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-sm)'
            }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>
                Imported Files ({importedFiles.length})
              </h3>
              {validCount > 0 && (
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-severity-low)'
                }}>
                  {validCount} valid · {totalResponses} responses
                </span>
              )}
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-sm)'
            }}>
              {importedFiles.map((file, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    backgroundColor: file.valid
                      ? 'rgba(72, 187, 120, 0.1)'
                      : 'rgba(245, 101, 101, 0.1)',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${file.valid
                      ? 'rgba(72, 187, 120, 0.3)'
                      : 'rgba(245, 101, 101, 0.3)'
                    }`
                  }}
                >
                  <span style={{
                    color: file.valid
                      ? 'var(--color-severity-low)'
                      : 'var(--color-severity-high)',
                    fontSize: '1rem'
                  }}>
                    {file.valid ? '✓' : '×'}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {file.participantName}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: file.valid
                        ? 'var(--color-text-secondary)'
                        : 'var(--color-severity-high)'
                    }}>
                      {file.valid
                        ? `${file.responseCount} responses`
                        : file.error
                      }
                    </div>
                  </div>

                  <button
                    className="btn btn-ghost"
                    onClick={() => handleRemoveFile(index)}
                    style={{ padding: 'var(--spacing-xs)' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {importedFiles.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-xl)',
            backgroundColor: 'var(--color-bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--color-border)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <div style={{
              fontSize: '2rem',
              marginBottom: 'var(--spacing-sm)'
            }}>
              📥
            </div>
            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
              No response files added yet.
              <br />
              Click "Add Response File" to import.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-sm" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleImportAll}
            disabled={validCount === 0}
          >
            Import {totalResponses} Responses
          </button>
        </div>
      </div>
    </div>
  )
}
