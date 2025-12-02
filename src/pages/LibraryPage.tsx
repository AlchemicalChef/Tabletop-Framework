import { useState } from 'react'
import { libraryScenarios, type LibraryEntry } from '../data/library'
import { useScenarioStore } from '../stores/scenario.store'

type View = 'home' | 'author' | 'runner' | 'library' | 'participant'

interface LibraryPageProps {
  onNavigate: (view: View) => void
}

const categoryColors: Record<string, string> = {
  ransomware: '#f56565',
  phishing: '#ed8936',
  insider_threat: '#ecc94b',
  ics_compromise: '#9f7aea',
  data_breach: '#4299e1',
  supply_chain: '#48bb78',
  social_engineering: '#ed64a6',
  ddos: '#667eea',
  apt: '#d53f8c',
  custom: '#718096'
}

const difficultyColors: Record<string, string> = {
  beginner: '#48bb78',
  intermediate: '#ecc94b',
  advanced: '#f56565'
}

export default function LibraryPage({ onNavigate }: LibraryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [previewScenario, setPreviewScenario] = useState<LibraryEntry | null>(null)
  const { loadScenario } = useScenarioStore()

  const filteredScenarios = libraryScenarios.filter(scenario => {
    const matchesCategory = selectedCategory === 'all' || scenario.category === selectedCategory
    const matchesSearch = scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scenario.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scenario.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleUseTemplate = (entry: LibraryEntry) => {
    // Create a copy with new IDs to make it a new scenario
    const newScenario = {
      ...entry.scenario,
      id: crypto.randomUUID(),
      title: `${entry.scenario.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      modules: entry.scenario.modules.map(m => ({
        ...m,
        id: crypto.randomUUID(),
        injects: m.injects.map(i => ({
          ...i,
          id: crypto.randomUUID()
        })),
        discussionQuestions: m.discussionQuestions.map(q => ({
          ...q,
          id: crypto.randomUUID()
        }))
      }))
    }
    loadScenario(newScenario)
    onNavigate('author')
  }

  const handleImportScenario = async () => {
    const filePath = await window.electronAPI?.openFileDialog({
      filters: [
        { name: 'CTEP Scenarios', extensions: ['ctep.json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (!filePath) return

    const result = await window.electronAPI?.readFile(filePath)
    if (!result?.success || !result.data) {
      alert('Failed to read scenario file')
      return
    }

    try {
      const parsed = JSON.parse(result.data)
      const scenario = parsed.scenario || parsed
      loadScenario(scenario)
      onNavigate('author')
    } catch (error) {
      alert('Failed to parse scenario file')
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center gap-md">
          <button className="btn btn-ghost" onClick={() => onNavigate('home')}>
            ← Back
          </button>
          <h1 className="page-title">Scenario Library</h1>
        </div>
        <div className="flex gap-sm">
          <button className="btn btn-secondary" onClick={handleImportScenario}>
            Import Scenario
          </button>
        </div>
      </div>

      <div className="page-content">
        {/* Filters */}
        <div className="flex gap-md" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <input
            type="text"
            className="input"
            placeholder="Search scenarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
          <select
            className="input"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ maxWidth: '200px' }}
          >
            <option value="all">All Categories</option>
            <option value="ransomware">Ransomware</option>
            <option value="phishing">Phishing / BEC</option>
            <option value="social_engineering">Social Engineering</option>
            <option value="insider_threat">Insider Threat</option>
            <option value="ics_compromise">ICS/OT Compromise</option>
            <option value="data_breach">Data Breach</option>
            <option value="supply_chain">Supply Chain</option>
            <option value="ddos">DDoS</option>
            <option value="apt">APT</option>
          </select>
        </div>

        {/* Stats Bar */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
          padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{libraryScenarios.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Scenarios</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {libraryScenarios.reduce((sum, s) => sum + s.moduleCount, 0)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Total Modules</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {libraryScenarios.reduce((sum, s) => sum + s.injectCount, 0)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Total Injects</div>
          </div>
        </div>

        {/* Scenario Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: 'var(--spacing-lg)'
        }}>
          {filteredScenarios.map(scenario => (
            <div key={scenario.id} className="card">
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: `${categoryColors[scenario.category]}20`,
                      color: categoryColors[scenario.category],
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}
                  >
                    {scenario.category.replace('_', ' ')}
                  </span>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: `${difficultyColors[scenario.difficulty]}20`,
                      color: difficultyColors[scenario.difficulty],
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textTransform: 'capitalize'
                    }}
                  >
                    {scenario.difficulty}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                    {scenario.duration} min
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
                  {scenario.title}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {scenario.description}
                </p>
              </div>

              {/* Scenario Stats */}
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-md)',
                padding: 'var(--spacing-sm)',
                backgroundColor: 'var(--color-bg-tertiary)',
                borderRadius: 'var(--radius-sm)'
              }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 600 }}>{scenario.moduleCount}</div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>Modules</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 600 }}>{scenario.injectCount}</div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>Injects</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 600 }}>{scenario.questionCount}</div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>Questions</div>
                </div>
              </div>

              {/* Tags */}
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                  {scenario.tags.slice(0, 4).map(tag => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '0.75rem',
                        padding: '2px 8px',
                        backgroundColor: 'var(--color-bg-tertiary)',
                        borderRadius: 'var(--radius-full)',
                        color: 'var(--color-text-muted)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {scenario.tags.length > 4 && (
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)'
                    }}>
                      +{scenario.tags.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-sm">
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => handleUseTemplate(scenario)}
                >
                  Use Template
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setPreviewScenario(scenario)}
                >
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredScenarios.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              No scenarios found matching your criteria.
            </p>
          </div>
        )}

        {/* Info about creating custom scenarios */}
        <div style={{
          marginTop: 'var(--spacing-2xl)',
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)'
        }}>
          <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Create Your Own</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
            These templates are starting points. Build completely custom scenarios tailored to your
            organization's specific threats, systems, and response procedures.
          </p>
          <button className="btn btn-secondary" onClick={() => onNavigate('author')}>
            Start From Scratch
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {previewScenario && (
        <div
          style={{
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
          onClick={() => setPreviewScenario(null)}
        >
          <div
            className="card"
            style={{
              width: '800px',
              maxHeight: '85vh',
              overflow: 'auto',
              margin: 'var(--spacing-lg)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <div>
                <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: `${categoryColors[previewScenario.category]}20`,
                      color: categoryColors[previewScenario.category],
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}
                  >
                    {previewScenario.category.replace('_', ' ')}
                  </span>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: `${difficultyColors[previewScenario.difficulty]}20`,
                      color: difficultyColors[previewScenario.difficulty],
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}
                  >
                    {previewScenario.difficulty}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                    ~{previewScenario.duration} min
                  </span>
                </div>
                <h2 style={{ margin: 0 }}>{previewScenario.title}</h2>
              </div>
              <button className="btn btn-ghost" onClick={() => setPreviewScenario(null)}>
                ×
              </button>
            </div>

            {/* Description */}
            <p style={{
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              marginBottom: 'var(--spacing-lg)'
            }}>
              {previewScenario.scenario.description}
            </p>

            {/* Objectives */}
            {previewScenario.scenario.objectives && previewScenario.scenario.objectives.length > 0 && (
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
                  Learning Objectives
                </h3>
                <ul style={{
                  margin: 0,
                  paddingLeft: 'var(--spacing-lg)',
                  color: 'var(--color-text-secondary)'
                }}>
                  {previewScenario.scenario.objectives.map((obj, i) => (
                    <li key={i} style={{ marginBottom: 'var(--spacing-xs)' }}>{obj}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Target Audience */}
            {previewScenario.scenario.targetAudience && previewScenario.scenario.targetAudience.length > 0 && (
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
                  Target Audience
                </h3>
                <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                  {previewScenario.scenario.targetAudience.map((audience, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: 'var(--color-bg-tertiary)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.875rem'
                      }}
                    >
                      {audience}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modules Overview */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                Modules ({previewScenario.scenario.modules.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {previewScenario.scenario.modules.map((module, index) => (
                  <div
                    key={module.id}
                    style={{
                      padding: 'var(--spacing-md)',
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid var(--color-primary)'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 'var(--spacing-xs)'
                    }}>
                      <div style={{ fontWeight: 600 }}>
                        {index + 1}. {module.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {module.suggestedDuration || '?'} min
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                      marginBottom: 'var(--spacing-xs)'
                    }}>
                      Phase: {module.phase.replace('_', ' ')} · {module.injects.length} injects · {module.discussionQuestions.length} questions
                    </div>
                    {module.description && (
                      <div style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)'
                      }}>
                        {module.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Facilitator Guide Preview */}
            {previewScenario.scenario.facilitatorGuide && (
              <div style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'rgba(159, 122, 234, 0.1)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--spacing-lg)'
              }}>
                <h3 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: 'var(--spacing-sm)',
                  color: '#9f7aea'
                }}>
                  {previewScenario.scenario.facilitatorGuide.title || 'Facilitator Guide'}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                  lineHeight: 1.5
                }}>
                  {previewScenario.scenario.facilitatorGuide.content}
                </p>
              </div>
            )}

            {/* Tags */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
                Tags
              </h3>
              <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                {previewScenario.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.75rem',
                      padding: '4px 12px',
                      backgroundColor: 'var(--color-bg-tertiary)',
                      borderRadius: 'var(--radius-full)',
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-sm" style={{ justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setPreviewScenario(null)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleUseTemplate(previewScenario)
                  setPreviewScenario(null)
                }}
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
