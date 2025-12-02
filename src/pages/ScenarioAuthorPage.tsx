import { useState, useEffect, useCallback } from 'react'
import { useScenarioStore } from '../stores/scenario.store'
import ModuleEditor from '../components/scenario/ModuleEditor'

type View = 'home' | 'author' | 'runner' | 'library' | 'participant'

interface ScenarioAuthorPageProps {
  onNavigate: (view: View) => void
}

export default function ScenarioAuthorPage({ onNavigate }: ScenarioAuthorPageProps) {
  const {
    currentScenario,
    isDirty,
    filePath,
    createNewScenario,
    updateScenario,
    markSaved,
    addModule,
    updateModule,
    removeModule,
    addInject,
    updateInject,
    removeInject,
    addQuestion,
    updateQuestion,
    removeQuestion,
    undo,
    redo,
    canUndo,
    canRedo
  } = useScenarioStore()

  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'materials'>('overview')
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Initialize with a new scenario if none exists
  useEffect(() => {
    if (!currentScenario) {
      createNewScenario()
    }
  }, [currentScenario, createNewScenario])

  // Save handler with error feedback
  const handleSave = useCallback(async () => {
    if (!currentScenario) return

    setSaveError(null)

    try {
      let saveFilePath = filePath

      if (!saveFilePath) {
        saveFilePath = await window.electronAPI?.saveFileDialog({
          defaultPath: `${currentScenario.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ctep.json`,
          filters: [{ name: 'CTEP Scenario', extensions: ['ctep.json'] }]
        })
      }

      if (!saveFilePath) return

      const fileContent = JSON.stringify({
        $schema: 'https://ctep-framework.org/schema/v1/scenario.json',
        version: '1.0.0',
        formatVersion: '1.0',
        metadata: {
          id: currentScenario.id,
          title: currentScenario.title,
          createdAt: currentScenario.createdAt,
          updatedAt: new Date().toISOString()
        },
        scenario: currentScenario
      }, null, 2)

      const result = await window.electronAPI?.writeFile(saveFilePath, fileContent)

      if (result?.success) {
        markSaved(saveFilePath)
        setShowSaveSuccess(true)
        setTimeout(() => setShowSaveSuccess(false), 2000)
      } else {
        setSaveError(result?.error || 'Failed to save file')
        setTimeout(() => setSaveError(null), 5000)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setSaveError(errorMessage)
      setTimeout(() => setSaveError(null), 5000)
      console.error('Failed to save:', error)
    }
  }, [currentScenario, filePath, markSaved])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo()) undo()
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        if (canRedo()) redo()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canUndo, canRedo, undo, redo, handleSave])

  const handleAddModule = () => {
    addModule()
    // Expand the newly added module
    const newModuleId = currentScenario?.modules[currentScenario.modules.length - 1]?.id
    if (newModuleId) {
      setExpandedModuleId(newModuleId)
      setActiveTab('modules')
    }
  }

  if (!currentScenario) {
    return (
      <div className="page">
        <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const totalInjects = currentScenario.modules.reduce((sum, m) => sum + m.injects.length, 0)
  const totalQuestions = currentScenario.modules.reduce((sum, m) => sum + m.discussionQuestions.length, 0)

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-md">
          <button className="btn btn-ghost" onClick={() => onNavigate('home')}>
            ← Back
          </button>
          <div>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              {currentScenario.title || 'Untitled Scenario'}
              {isDirty && <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>*</span>}
            </h1>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {currentScenario.modules.length} modules · {totalInjects} injects · {totalQuestions} questions
            </div>
          </div>
        </div>
        <div className="flex items-center gap-sm">
          <div className="flex gap-sm" style={{ marginRight: 'var(--spacing-md)' }}>
            <button
              className="btn btn-ghost"
              onClick={undo}
              disabled={!canUndo()}
              title="Undo (Ctrl+Z)"
              style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
            >
              ↶
            </button>
            <button
              className="btn btn-ghost"
              onClick={redo}
              disabled={!canRedo()}
              title="Redo (Ctrl+Y)"
              style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
            >
              ↷
            </button>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => alert('Preview functionality coming soon. Use Exercise Runner to preview your scenario.')}
          >
            Preview
          </button>
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-primary"
              onClick={handleSave}
            >
              {showSaveSuccess ? '✓ Saved' : 'Save'}
            </button>
            {saveError && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 'var(--spacing-xs)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'var(--color-severity-critical)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
                zIndex: 100
              }}>
                {saveError}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        padding: 'var(--spacing-sm) var(--spacing-lg)',
        backgroundColor: 'var(--color-bg-secondary)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="nav-tabs" style={{ display: 'inline-flex' }}>
          <button
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`nav-tab ${activeTab === 'modules' ? 'active' : ''}`}
            onClick={() => setActiveTab('modules')}
          >
            Modules & Injects ({currentScenario.modules.length})
          </button>
          <button
            className={`nav-tab ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveTab('materials')}
          >
            Materials
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="page-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ maxWidth: '800px' }}>
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 className="card-title" style={{ marginBottom: 'var(--spacing-md)' }}>Scenario Details</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--spacing-xs)',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}>
                    Title
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={currentScenario.title}
                    onChange={(e) => updateScenario({ title: e.target.value })}
                    placeholder="Enter scenario title..."
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--spacing-xs)',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}>
                    Description
                  </label>
                  <textarea
                    className="input"
                    rows={4}
                    value={currentScenario.description}
                    onChange={(e) => updateScenario({ description: e.target.value })}
                    placeholder="Describe the scenario background and context..."
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: 'var(--spacing-xs)',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}>
                      Threat Category
                    </label>
                    <select
                      className="input"
                      value={currentScenario.threatCategory}
                      onChange={(e) => updateScenario({ threatCategory: e.target.value as any })}
                    >
                      <option value="ransomware">Ransomware</option>
                      <option value="phishing">Phishing</option>
                      <option value="insider_threat">Insider Threat</option>
                      <option value="ics_compromise">ICS/OT Compromise</option>
                      <option value="data_breach">Data Breach</option>
                      <option value="supply_chain">Supply Chain</option>
                      <option value="ddos">DDoS</option>
                      <option value="apt">APT</option>
                      <option value="social_engineering">Social Engineering</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: 'var(--spacing-xs)',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}>
                      Difficulty
                    </label>
                    <select
                      className="input"
                      value={currentScenario.difficulty}
                      onChange={(e) => updateScenario({ difficulty: e.target.value as any })}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: 'var(--spacing-xs)',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}>
                      Estimated Duration (minutes)
                    </label>
                    <input
                      type="number"
                      className="input"
                      value={currentScenario.estimatedDuration}
                      onChange={(e) => updateScenario({ estimatedDuration: parseInt(e.target.value) || 120 })}
                      min={15}
                      max={480}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: 'var(--spacing-xs)',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}>
                      Author
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={currentScenario.author}
                      onChange={(e) => updateScenario({ author: e.target.value })}
                      placeholder="Your name or organization..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 className="card-title" style={{ marginBottom: 'var(--spacing-md)' }}>Learning Objectives</h3>
              <p className="card-description" style={{ marginBottom: 'var(--spacing-md)' }}>
                Define what participants should learn or practice during this exercise.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {currentScenario.objectives.map((objective, index) => (
                  <div key={index} className="flex gap-sm">
                    <span style={{
                      width: '24px',
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                      flexShrink: 0
                    }}>
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      className="input"
                      value={objective}
                      onChange={(e) => {
                        const newObjectives = [...currentScenario.objectives]
                        newObjectives[index] = e.target.value
                        updateScenario({ objectives: newObjectives })
                      }}
                      placeholder={`Objective ${index + 1}`}
                    />
                    <button
                      className="btn btn-ghost"
                      aria-label={`Remove objective ${index + 1}`}
                      onClick={() => {
                        const newObjectives = currentScenario.objectives.filter((_, i) => i !== index)
                        updateScenario({ objectives: newObjectives })
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  className="btn btn-secondary"
                  style={{ alignSelf: 'flex-start', marginLeft: '32px' }}
                  onClick={() => {
                    updateScenario({ objectives: [...currentScenario.objectives, ''] })
                  }}
                >
                  + Add Objective
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title" style={{ marginBottom: 'var(--spacing-md)' }}>Tags</h3>
              <p className="card-description" style={{ marginBottom: 'var(--spacing-md)' }}>
                Add tags to help categorize and search for this scenario.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                {currentScenario.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      backgroundColor: 'var(--color-bg-tertiary)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.875rem'
                    }}
                  >
                    {tag}
                    <button
                      aria-label={`Remove tag: ${tag}`}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        padding: '2px',
                        fontSize: '1rem',
                        lineHeight: 1,
                        borderRadius: 'var(--radius-sm)'
                      }}
                      onClick={() => {
                        const newTags = currentScenario.tags.filter((_, i) => i !== index)
                        updateScenario({ tags: newTags })
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-sm">
                <input
                  type="text"
                  className="input"
                  placeholder="Add a tag..."
                  style={{ maxWidth: '200px' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement
                      const value = input.value.trim()
                      if (value && !currentScenario.tags.includes(value)) {
                        updateScenario({ tags: [...currentScenario.tags, value] })
                        input.value = ''
                      }
                    }
                  }}
                />
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', alignSelf: 'center' }}>
                  Press Enter to add
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Modules Tab */}
        {activeTab === 'modules' && (
          <div style={{ maxWidth: '1000px' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
                  Modules
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  Organize your exercise into phases. Each module contains injects and discussion questions.
                </p>
              </div>
              <button className="btn btn-primary" onClick={handleAddModule}>
                + Add Module
              </button>
            </div>

            {currentScenario.modules.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-lg)',
                  fontSize: '1.5rem'
                }}>
                  📋
                </div>
                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>No Modules Yet</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)', maxWidth: '400px', margin: '0 auto var(--spacing-lg)' }}>
                  Modules represent phases of your incident response exercise. Start by adding your first module.
                </p>
                <button className="btn btn-primary" onClick={handleAddModule}>
                  + Add First Module
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {currentScenario.modules
                  .sort((a, b) => a.order - b.order)
                  .map((module) => (
                    <ModuleEditor
                      key={module.id}
                      module={module}
                      isExpanded={expandedModuleId === module.id}
                      onToggleExpand={() => setExpandedModuleId(
                        expandedModuleId === module.id ? null : module.id
                      )}
                      onUpdate={(updates) => updateModule(module.id, updates)}
                      onDelete={() => removeModule(module.id)}
                      onAddInject={() => addInject(module.id)}
                      onUpdateInject={(injectId, updates) => updateInject(module.id, injectId, updates)}
                      onDeleteInject={(injectId) => removeInject(module.id, injectId)}
                      onAddQuestion={() => addQuestion(module.id)}
                      onUpdateQuestion={(questionId, updates) => updateQuestion(module.id, questionId, updates)}
                      onDeleteQuestion={(questionId) => removeQuestion(module.id, questionId)}
                    />
                  ))}

                <button
                  className="btn btn-secondary"
                  style={{
                    alignSelf: 'center',
                    marginTop: 'var(--spacing-md)'
                  }}
                  onClick={handleAddModule}
                >
                  + Add Another Module
                </button>
              </div>
            )}
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div style={{ maxWidth: '800px' }}>
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 className="card-title" style={{ marginBottom: 'var(--spacing-sm)' }}>Supporting Materials</h3>
              <p className="card-description" style={{ marginBottom: 'var(--spacing-lg)' }}>
                Add facilitator guides, participant handouts, and other supporting documents.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <div className="card" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <strong>Facilitator Guide</strong>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        {currentScenario.facilitatorGuide ? 'Created' : 'Not created'}
                      </p>
                    </div>
                    <button
                      className="btn btn-secondary"
                      onClick={() => alert('Facilitator Guide editor coming soon.')}
                    >
                      {currentScenario.facilitatorGuide ? 'Edit' : 'Create'}
                    </button>
                  </div>
                </div>

                <div className="card" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <strong>Participant Handout</strong>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        {currentScenario.participantHandout ? 'Created' : 'Not created'}
                      </p>
                    </div>
                    <button
                      className="btn btn-secondary"
                      onClick={() => alert('Participant Handout editor coming soon.')}
                    >
                      {currentScenario.participantHandout ? 'Edit' : 'Create'}
                    </button>
                  </div>
                </div>

                <div className="card" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <strong>AAR Template</strong>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        {currentScenario.aarTemplate ? 'Created' : 'Not created'}
                      </p>
                    </div>
                    <button
                      className="btn btn-secondary"
                      onClick={() => alert('AAR Template editor coming soon.')}
                    >
                      {currentScenario.aarTemplate ? 'Edit' : 'Create'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title" style={{ marginBottom: 'var(--spacing-sm)' }}>Additional Materials</h3>
              <p className="card-description" style={{ marginBottom: 'var(--spacing-lg)' }}>
                Add reference documents, checklists, or other supporting files.
              </p>

              {currentScenario.additionalMaterials.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-lg)',
                  backgroundColor: 'var(--color-bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--color-border)'
                }}>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }}>
                    No additional materials yet.
                  </p>
                  <button
                    className="btn btn-secondary"
                    onClick={() => alert('Add Material functionality coming soon.')}
                  >
                    + Add Material
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {currentScenario.additionalMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="card"
                      style={{ backgroundColor: 'var(--color-bg-tertiary)', padding: 'var(--spacing-md)' }}
                    >
                      <div className="flex justify-between items-center">
                        <strong>{material.title}</strong>
                        <button
                          className="btn btn-ghost"
                          onClick={() => alert('Edit Material functionality coming soon.')}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    className="btn btn-secondary"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={() => alert('Add Material functionality coming soon.')}
                  >
                    + Add Material
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
