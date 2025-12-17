import { useState } from 'react'
import type { FacilitatorNote, NoteCategory } from '../../types/exercise.types'

interface FacilitatorNotesProps {
  notes: FacilitatorNote[]
  elapsedTime: number
  onAddNote: (content: string, category: NoteCategory) => void
  onUpdateNote: (noteId: string, content: string) => void
  onDeleteNote: (noteId: string) => void
}

const CATEGORY_CONFIG: Record<NoteCategory, { label: string; color: string; icon: string }> = {
  observation: { label: 'Observation', color: '#4299e1', icon: '👁️' },
  action_item: { label: 'Action Item', color: '#f56565', icon: '⚡' },
  follow_up: { label: 'Follow-up', color: '#ed8936', icon: '📌' },
  general: { label: 'General', color: '#a0aec0', icon: '📝' }
}

function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export default function FacilitatorNotes({
  notes,
  elapsedTime,
  onAddNote,
  onUpdateNote,
  onDeleteNote
}: FacilitatorNotesProps) {
  const [newNoteContent, setNewNoteContent] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory>('observation')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [isExpanded, setIsExpanded] = useState(true)

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      onAddNote(newNoteContent.trim(), selectedCategory)
      setNewNoteContent('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAddNote()
    }
  }

  const startEditing = (note: FacilitatorNote) => {
    setEditingNoteId(note.id)
    setEditContent(note.content)
  }

  const saveEdit = (noteId: string) => {
    if (editContent.trim()) {
      onUpdateNote(noteId, editContent.trim())
    }
    setEditingNoteId(null)
    setEditContent('')
  }

  const cancelEdit = () => {
    setEditingNoteId(null)
    setEditContent('')
  }

  // Sort notes by timestamp descending (newest first)
  const sortedNotes = [...notes].sort((a, b) => b.timestamp - a.timestamp)

  // Group notes by category for summary
  const notesByCategory = notes.reduce((acc, note) => {
    acc[note.category] = (acc[note.category] || 0) + 1
    return acc
  }, {} as Record<NoteCategory, number>)

  return (
    <div style={{
      backgroundColor: 'var(--color-bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: 'var(--spacing-md)',
          backgroundColor: 'transparent',
          border: 'none',
          borderBottom: isExpanded ? '1px solid var(--color-border)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <span style={{ fontSize: '1rem' }}>📝</span>
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
            Notes
          </span>
          <span style={{
            backgroundColor: 'var(--color-bg-tertiary)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)'
          }}>
            {notes.length}
          </span>
        </div>
        <span style={{
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)'
        }}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <>
          {/* Quick Stats */}
          {notes.length > 0 && (
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-xs)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--color-bg-tertiary)',
              borderBottom: '1px solid var(--color-border)',
              flexWrap: 'wrap'
            }}>
              {(Object.keys(notesByCategory) as NoteCategory[]).map(category => (
                <span
                  key={category}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: `${CATEGORY_CONFIG[category].color}20`,
                    color: CATEGORY_CONFIG[category].color,
                    fontSize: '0.625rem',
                    fontWeight: 500
                  }}
                >
                  {CATEGORY_CONFIG[category].icon} {notesByCategory[category]}
                </span>
              ))}
            </div>
          )}

          {/* Add Note Form */}
          <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)' }}>
            {/* Category Selector */}
            <div style={{
              display: 'flex',
              gap: '4px',
              marginBottom: 'var(--spacing-sm)'
            }}>
              {(Object.keys(CATEGORY_CONFIG) as NoteCategory[]).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: selectedCategory === category
                      ? `${CATEGORY_CONFIG[category].color}20`
                      : 'var(--color-bg-tertiary)',
                    color: selectedCategory === category
                      ? CATEGORY_CONFIG[category].color
                      : 'var(--color-text-muted)',
                    fontSize: '0.625rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {CATEGORY_CONFIG[category].icon}
                  {CATEGORY_CONFIG[category].label}
                </button>
              ))}
            </div>

            {/* Note Input */}
            <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
              <textarea
                className="input"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a note... (Enter to save)"
                rows={2}
                style={{
                  flex: 1,
                  resize: 'none',
                  fontSize: '0.875rem'
                }}
              />
              <button
                onClick={handleAddNote}
                disabled={!newNoteContent.trim()}
                className="btn btn-primary"
                style={{
                  alignSelf: 'flex-end',
                  padding: 'var(--spacing-sm) var(--spacing-md)'
                }}
              >
                Add
              </button>
            </div>
            <div style={{
              marginTop: 'var(--spacing-xs)',
              fontSize: '0.625rem',
              color: 'var(--color-text-muted)'
            }}>
              @ {formatTimestamp(elapsedTime)}
            </div>
          </div>

          {/* Notes List */}
          <div style={{
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {sortedNotes.length === 0 ? (
              <div style={{
                padding: 'var(--spacing-lg)',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem'
              }}>
                No notes yet. Start capturing observations and action items.
              </div>
            ) : (
              sortedNotes.map(note => {
                const config = CATEGORY_CONFIG[note.category]
                const isEditing = editingNoteId === note.id

                return (
                  <div
                    key={note.id}
                    style={{
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: isEditing ? 'var(--color-bg-tertiary)' : 'transparent'
                    }}
                  >
                    {/* Note Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 'var(--spacing-xs)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                        <span style={{
                          fontSize: '0.625rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--color-text-muted)'
                        }}>
                          {formatTimestamp(note.timestamp)}
                        </span>
                        <span style={{
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: `${config.color}20`,
                          color: config.color,
                          fontSize: '0.625rem',
                          fontWeight: 500
                        }}>
                          {config.icon} {config.label}
                        </span>
                      </div>
                      {!isEditing && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => startEditing(note)}
                            style={{
                              padding: '2px 6px',
                              borderRadius: 'var(--radius-sm)',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: 'var(--color-text-muted)',
                              fontSize: '0.625rem',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteNote(note.id)}
                            style={{
                              padding: '2px 6px',
                              borderRadius: 'var(--radius-sm)',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: 'var(--color-accent-danger)',
                              fontSize: '0.625rem',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Note Content */}
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                        <textarea
                          className="input"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={2}
                          style={{ resize: 'none', fontSize: '0.875rem' }}
                          autoFocus
                        />
                        <div style={{ display: 'flex', gap: 'var(--spacing-xs)', justifyContent: 'flex-end' }}>
                          <button
                            onClick={cancelEdit}
                            className="btn btn-ghost"
                            style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => saveEdit(note.id)}
                            className="btn btn-primary"
                            style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p style={{
                        margin: 0,
                        fontSize: '0.875rem',
                        color: 'var(--color-text-primary)',
                        lineHeight: 1.4,
                        whiteSpace: 'pre-wrap'
                      }}>
                        {note.content}
                      </p>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </>
      )}
    </div>
  )
}
