import { useState } from 'react'
import type { Exercise, ParticipantResponse, FacilitatorNote, NoteCategory } from '../../types/exercise.types'
import type { Scenario, Module } from '../../types/scenario.types'

interface AARGeneratorProps {
  exercise: Exercise
  scenario: Scenario
  facilitatorNotes?: FacilitatorNote[]
  onClose: () => void
}

const NOTE_CATEGORY_LABELS: Record<NoteCategory, string> = {
  observation: 'Observation',
  action_item: 'Action Item',
  follow_up: 'Follow-up',
  general: 'General'
}

interface AARData {
  summary: {
    title: string
    scenarioTitle: string
    date: string
    duration: string
    status: string
    modulesCompleted: number
    totalModules: number
    totalResponses: number
    totalNotes: number
  }
  timeline: {
    time: string
    event: string
    type: 'inject' | 'response' | 'milestone' | 'note'
    details?: string
  }[]
  moduleReviews: {
    moduleTitle: string
    phase: string
    duration: string
    injectsDisplayed: number
    questionsAnswered: number
    responses: {
      question: string
      responses: string[]
    }[]
  }[]
  facilitatorNotes: {
    timestamp: string
    category: string
    content: string
    moduleId: string
  }[]
  keyFindings: string[]
  recommendations: string[]
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes} minutes`
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString()
}

export default function AARGenerator({ exercise, scenario, facilitatorNotes = [], onClose }: AARGeneratorProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'timeline' | 'responses' | 'notes' | 'export'>('summary')
  const [isExporting, setIsExporting] = useState(false)

  // Generate AAR data
  const generateAARData = (): AARData => {
    const startTime = exercise.startTime ? new Date(exercise.startTime) : new Date()
    const endTime = exercise.endTime ? new Date(exercise.endTime) : new Date()

    // Build timeline from inject logs and responses
    const timeline: AARData['timeline'] = []

    // Add inject display events
    exercise.injectLogs.forEach(log => {
      const module = scenario.modules.find(m =>
        m.injects.some(i => i.id === log.injectId)
      )
      const inject = module?.injects.find(i => i.id === log.injectId)

      if (inject) {
        timeline.push({
          time: formatTimestamp(log.displayedAt),
          event: `Inject: ${inject.title}`,
          type: 'inject',
          details: `Severity: ${inject.severity}`
        })

        if (log.acknowledgedAt) {
          timeline.push({
            time: formatTimestamp(log.acknowledgedAt),
            event: `Acknowledged: ${inject.title}`,
            type: 'milestone'
          })
        }
      }
    })

    // Add response events
    exercise.responses.forEach(response => {
      const module = scenario.modules.find(m => m.id === response.moduleId)
      const question = module?.discussionQuestions.find(q => q.id === response.questionId)

      if (question) {
        timeline.push({
          time: formatTimestamp(response.submittedAt),
          event: `Response recorded`,
          type: 'response',
          details: question.question.substring(0, 50) + '...'
        })
      }
    })

    // Add facilitator notes to timeline
    facilitatorNotes.forEach(note => {
      timeline.push({
        time: formatTimestamp(note.createdAt),
        event: `Note: ${NOTE_CATEGORY_LABELS[note.category]}`,
        type: 'note',
        details: note.content.substring(0, 80) + (note.content.length > 80 ? '...' : '')
      })
    })

    // Sort timeline by time
    timeline.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())

    // Build module reviews
    const moduleReviews = scenario.modules.map(module => {
      const moduleResponses = exercise.responses.filter(r => r.moduleId === module.id)
      const moduleInjectLogs = exercise.injectLogs.filter(log =>
        module.injects.some(i => i.id === log.injectId)
      )

      const responsesGroupedByQuestion = module.discussionQuestions.map(q => {
        const questionResponses = moduleResponses
          .filter(r => r.questionId === q.id)
          .map(r => r.textResponse || '')
          .filter(r => r)

        return {
          question: q.question,
          responses: questionResponses
        }
      }).filter(r => r.responses.length > 0)

      return {
        moduleTitle: module.title,
        phase: module.phase.replace('_', ' '),
        duration: module.suggestedDuration ? `${module.suggestedDuration} min` : 'N/A',
        injectsDisplayed: moduleInjectLogs.length,
        questionsAnswered: responsesGroupedByQuestion.length,
        responses: responsesGroupedByQuestion
      }
    })

    // Generate key findings (placeholder - could be enhanced with AI)
    const keyFindings: string[] = []
    if (exercise.responses.length > 0) {
      keyFindings.push(`${exercise.responses.length} discussion responses were captured during the exercise.`)
    }
    if (exercise.injectLogs.length > 0) {
      const acknowledgedCount = exercise.injectLogs.filter(l => l.acknowledgedAt).length
      keyFindings.push(`${acknowledgedCount} of ${exercise.injectLogs.length} injects were formally acknowledged.`)
    }
    if (facilitatorNotes.length > 0) {
      const actionItems = facilitatorNotes.filter(n => n.category === 'action_item').length
      const followUps = facilitatorNotes.filter(n => n.category === 'follow_up').length
      keyFindings.push(`${facilitatorNotes.length} facilitator notes were recorded (${actionItems} action items, ${followUps} follow-ups).`)
    }

    // Generate recommendations (placeholder)
    const recommendations: string[] = [
      'Review captured responses with the team to identify common themes.',
      'Document any procedural gaps identified during discussion.',
      'Schedule follow-up training for areas where uncertainty was expressed.',
      'Update incident response procedures based on lessons learned.'
    ]

    // Format facilitator notes for export
    const formattedNotes = facilitatorNotes.map(note => ({
      timestamp: formatTimestamp(note.createdAt),
      category: NOTE_CATEGORY_LABELS[note.category],
      content: note.content,
      moduleId: note.moduleId
    }))

    return {
      summary: {
        title: exercise.title,
        scenarioTitle: scenario.title,
        date: startTime.toLocaleDateString(),
        duration: formatDuration(exercise.totalElapsedTime),
        status: exercise.status,
        modulesCompleted: exercise.progress.completedModules.length,
        totalModules: scenario.modules.length,
        totalResponses: exercise.responses.length,
        totalNotes: facilitatorNotes.length
      },
      timeline,
      moduleReviews,
      facilitatorNotes: formattedNotes,
      keyFindings,
      recommendations
    }
  }

  const aarData = generateAARData()

  const handleExport = async (format: 'json' | 'html') => {
    setIsExporting(true)

    try {
      let content: string
      let filename: string
      let filters: { name: string; extensions: string[] }[]

      if (format === 'json') {
        content = JSON.stringify({
          version: '1.0',
          exportedAt: new Date().toISOString(),
          exercise: {
            id: exercise.id,
            title: exercise.title,
            scenarioTitle: scenario.title,
            startTime: exercise.startTime,
            endTime: exercise.endTime,
            totalDuration: exercise.totalElapsedTime
          },
          aar: aarData
        }, null, 2)
        filename = `aar-${exercise.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`
        filters = [{ name: 'JSON Files', extensions: ['json'] }]
      } else {
        // Generate HTML report
        content = generateHTMLReport(aarData)
        filename = `aar-${exercise.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.html`
        filters = [{ name: 'HTML Files', extensions: ['html'] }]
      }

      const filePath = await window.electronAPI?.saveFileDialog({
        defaultPath: filename,
        filters
      })

      if (filePath) {
        const result = await window.electronAPI?.writeFile(filePath, content)
        if (result?.success) {
          alert(`AAR exported successfully to ${filePath}`)
        } else {
          alert('Failed to export AAR')
        }
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export AAR')
    } finally {
      setIsExporting(false)
    }
  }

  const generateHTMLReport = (data: AARData): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>After Action Report - ${data.summary.scenarioTitle}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 0 auto; padding: 40px 20px; }
    h1 { font-size: 1.75rem; margin-bottom: 0.5rem; }
    h2 { font-size: 1.25rem; margin-top: 2rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e2e8f0; }
    h3 { font-size: 1rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
    .header { margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 3px solid #4299e1; }
    .subtitle { color: #718096; font-size: 1rem; }
    .meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin: 1.5rem 0; }
    .meta-item { background: #f7fafc; padding: 1rem; border-radius: 8px; }
    .meta-label { font-size: 0.75rem; color: #718096; text-transform: uppercase; }
    .meta-value { font-size: 1.25rem; font-weight: 600; }
    .module { background: #f7fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #4299e1; }
    .module-title { font-weight: 600; margin-bottom: 0.5rem; }
    .module-meta { font-size: 0.875rem; color: #718096; margin-bottom: 1rem; }
    .response-block { background: white; padding: 1rem; border-radius: 4px; margin-top: 0.5rem; border: 1px solid #e2e8f0; }
    .question { font-weight: 500; margin-bottom: 0.5rem; }
    .response { background: #edf2f7; padding: 0.75rem; border-radius: 4px; margin-top: 0.25rem; font-size: 0.875rem; }
    .note { background: #f7fafc; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; }
    .note-observation { border-left: 4px solid #4299e1; }
    .note-action { border-left: 4px solid #f56565; }
    .note-followup { border-left: 4px solid #ed8936; }
    .note-general { border-left: 4px solid #a0aec0; }
    .note-meta { font-size: 0.75rem; color: #718096; margin-bottom: 0.5rem; }
    .note-category { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 500; }
    .category-observation { background: rgba(66, 153, 225, 0.15); color: #4299e1; }
    .category-action { background: rgba(245, 101, 101, 0.15); color: #f56565; }
    .category-followup { background: rgba(237, 137, 54, 0.15); color: #ed8936; }
    .category-general { background: #edf2f7; color: #718096; }
    .timeline-item { display: flex; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid #e2e8f0; }
    .timeline-time { font-size: 0.75rem; color: #718096; min-width: 140px; }
    .timeline-event { flex: 1; }
    .timeline-details { font-size: 0.875rem; color: #718096; }
    ul { padding-left: 1.5rem; }
    li { margin-bottom: 0.5rem; }
    .footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.875rem; color: #718096; text-align: center; }
    @media print { body { padding: 20px; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>After Action Report</h1>
    <div class="subtitle">${data.summary.scenarioTitle}</div>
  </div>

  <div class="meta">
    <div class="meta-item">
      <div class="meta-label">Date</div>
      <div class="meta-value">${data.summary.date}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Duration</div>
      <div class="meta-value">${data.summary.duration}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Modules</div>
      <div class="meta-value">${data.summary.modulesCompleted}/${data.summary.totalModules}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Responses</div>
      <div class="meta-value">${data.summary.totalResponses}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Notes</div>
      <div class="meta-value">${data.summary.totalNotes}</div>
    </div>
  </div>

  <h2>Executive Summary</h2>
  <p>This tabletop exercise was conducted to practice incident response procedures and decision-making for the "${data.summary.scenarioTitle}" scenario. The exercise ran for ${data.summary.duration}, covering ${data.summary.modulesCompleted} of ${data.summary.totalModules} planned modules.</p>

  ${data.keyFindings.length > 0 ? `
  <h2>Key Findings</h2>
  <ul>
    ${data.keyFindings.map(f => `<li>${f}</li>`).join('\n    ')}
  </ul>
  ` : ''}

  <h2>Module Reviews</h2>
  ${data.moduleReviews.map(module => `
  <div class="module">
    <div class="module-title">${module.moduleTitle}</div>
    <div class="module-meta">Phase: ${module.phase} · ${module.injectsDisplayed} injects · ${module.questionsAnswered} questions answered</div>
    ${module.responses.length > 0 ? `
    <div class="responses">
      ${module.responses.map(r => `
      <div class="response-block">
        <div class="question">${r.question}</div>
        ${r.responses.map(resp => `<div class="response">${resp}</div>`).join('\n        ')}
      </div>
      `).join('\n      ')}
    </div>
    ` : '<p style="color: #718096; font-style: italic;">No responses recorded for this module.</p>'}
  </div>
  `).join('\n  ')}

  ${data.facilitatorNotes.length > 0 ? `
  <h2>Facilitator Notes</h2>
  <p style="margin-bottom: 1rem; color: #718096;">Notes captured by the facilitator during the exercise.</p>
  ${data.facilitatorNotes.map(note => {
    const categoryClass = note.category === 'Action Item' ? 'action' :
                         note.category === 'Follow-up' ? 'followup' :
                         note.category === 'Observation' ? 'observation' : 'general'
    return `
  <div class="note note-${categoryClass}">
    <div class="note-meta">
      <span>${note.timestamp}</span>
      <span class="note-category category-${categoryClass}">${note.category}</span>
    </div>
    <p>${note.content}</p>
  </div>`
  }).join('\n  ')}
  ` : ''}

  ${data.timeline.length > 0 ? `
  <h2>Exercise Timeline</h2>
  <div class="timeline">
    ${data.timeline.slice(0, 20).map(item => `
    <div class="timeline-item">
      <div class="timeline-time">${item.time}</div>
      <div>
        <div class="timeline-event">${item.event}</div>
        ${item.details ? `<div class="timeline-details">${item.details}</div>` : ''}
      </div>
    </div>
    `).join('\n    ')}
    ${data.timeline.length > 20 ? `<p style="color: #718096; font-style: italic;">... and ${data.timeline.length - 20} more events</p>` : ''}
  </div>
  ` : ''}

  <h2>Recommendations</h2>
  <ul>
    ${data.recommendations.map(r => `<li>${r}</li>`).join('\n    ')}
  </ul>

  <div class="footer">
    Generated by CTEP Tabletop Framework · ${new Date().toLocaleString()}
  </div>
</body>
</html>`
  }

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
          width: '900px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          margin: 'var(--spacing-lg)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--color-border)'
        }}>
          <div>
            <h2 style={{ margin: 0 }}>After Action Report</h2>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              {aarData.summary.scenarioTitle}
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>×</button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '2px',
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          backgroundColor: 'var(--color-bg-tertiary)'
        }}>
          {(['summary', 'timeline', 'responses', 'notes', 'export'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: activeTab === tab ? 'var(--color-bg-elevated)' : 'transparent',
                color: activeTab === tab ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 'var(--spacing-lg)' }}>
          {activeTab === 'summary' && (
            <div>
              {/* Stats Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)'
              }}>
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Date
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{aarData.summary.date}</div>
                </div>
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Duration
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{aarData.summary.duration}</div>
                </div>
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Modules
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                    {aarData.summary.modulesCompleted}/{aarData.summary.totalModules}
                  </div>
                </div>
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Responses
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{aarData.summary.totalResponses}</div>
                </div>
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Notes
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{aarData.summary.totalNotes}</div>
                </div>
              </div>

              {/* Key Findings */}
              {aarData.keyFindings.length > 0 && (
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
                    Key Findings
                  </h3>
                  <ul style={{
                    margin: 0,
                    paddingLeft: 'var(--spacing-lg)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    {aarData.keyFindings.map((finding, i) => (
                      <li key={i} style={{ marginBottom: 'var(--spacing-xs)' }}>{finding}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
                  Recommendations
                </h3>
                <ul style={{
                  margin: 0,
                  paddingLeft: 'var(--spacing-lg)',
                  color: 'var(--color-text-secondary)'
                }}>
                  {aarData.recommendations.map((rec, i) => (
                    <li key={i} style={{ marginBottom: 'var(--spacing-xs)' }}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div>
              {aarData.timeline.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                  No timeline events recorded.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                  {aarData.timeline.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: 'var(--spacing-md)',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        backgroundColor: i % 2 === 0 ? 'var(--color-bg-secondary)' : 'transparent',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-muted)',
                        minWidth: '150px'
                      }}>
                        {item.time}
                      </div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: item.type === 'inject' ? '#4299e1' :
                                        item.type === 'response' ? '#48bb78' : '#ecc94b',
                        marginTop: '6px',
                        flexShrink: 0
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500 }}>{item.event}</div>
                        {item.details && (
                          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                            {item.details}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'responses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              {aarData.moduleReviews.map((module, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--spacing-lg)',
                    borderLeft: '4px solid var(--color-primary)'
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
                    {module.moduleTitle}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: 'var(--spacing-md)'
                  }}>
                    Phase: {module.phase} · {module.injectsDisplayed} injects · {module.questionsAnswered} questions
                  </div>

                  {module.responses.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                      No responses recorded for this module.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                      {module.responses.map((r, j) => (
                        <div
                          key={j}
                          style={{
                            backgroundColor: 'var(--color-bg-elevated)',
                            padding: 'var(--spacing-md)',
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          <div style={{
                            fontWeight: 500,
                            marginBottom: 'var(--spacing-sm)',
                            fontSize: '0.875rem'
                          }}>
                            {r.question}
                          </div>
                          {r.responses.map((resp, k) => (
                            <div
                              key={k}
                              style={{
                                padding: 'var(--spacing-sm)',
                                backgroundColor: 'var(--color-bg-tertiary)',
                                borderRadius: 'var(--radius-sm)',
                                marginTop: 'var(--spacing-xs)',
                                fontSize: '0.875rem'
                              }}
                            >
                              {resp}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              {aarData.facilitatorNotes.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                  No facilitator notes were recorded during the exercise.
                </p>
              ) : (
                <>
                  {/* Notes by Category Summary */}
                  <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-sm)',
                    marginBottom: 'var(--spacing-lg)',
                    flexWrap: 'wrap'
                  }}>
                    {(['Observation', 'Action Item', 'Follow-up', 'General'] as const).map(category => {
                      const count = aarData.facilitatorNotes.filter(n => n.category === category).length
                      if (count === 0) return null
                      return (
                        <span
                          key={category}
                          style={{
                            padding: '4px 12px',
                            backgroundColor: category === 'Action Item' ? 'rgba(245, 101, 101, 0.15)' :
                                           category === 'Follow-up' ? 'rgba(237, 137, 54, 0.15)' :
                                           category === 'Observation' ? 'rgba(66, 153, 225, 0.15)' :
                                           'var(--color-bg-tertiary)',
                            color: category === 'Action Item' ? '#f56565' :
                                  category === 'Follow-up' ? '#ed8936' :
                                  category === 'Observation' ? '#4299e1' :
                                  'var(--color-text-secondary)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}
                        >
                          {count} {category}{count !== 1 ? 's' : ''}
                        </span>
                      )
                    })}
                  </div>

                  {/* Notes List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    {aarData.facilitatorNotes.map((note, i) => (
                      <div
                        key={i}
                        style={{
                          padding: 'var(--spacing-md)',
                          backgroundColor: 'var(--color-bg-secondary)',
                          borderRadius: 'var(--radius-md)',
                          borderLeft: `4px solid ${
                            note.category === 'Action Item' ? '#f56565' :
                            note.category === 'Follow-up' ? '#ed8936' :
                            note.category === 'Observation' ? '#4299e1' :
                            '#a0aec0'
                          }`
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-sm)',
                          marginBottom: 'var(--spacing-xs)'
                        }}>
                          <span style={{
                            fontSize: '0.625rem',
                            color: 'var(--color-text-muted)',
                            fontFamily: 'var(--font-mono)'
                          }}>
                            {note.timestamp}
                          </span>
                          <span style={{
                            padding: '2px 6px',
                            backgroundColor: note.category === 'Action Item' ? 'rgba(245, 101, 101, 0.15)' :
                                           note.category === 'Follow-up' ? 'rgba(237, 137, 54, 0.15)' :
                                           note.category === 'Observation' ? 'rgba(66, 153, 225, 0.15)' :
                                           'var(--color-bg-tertiary)',
                            color: note.category === 'Action Item' ? '#f56565' :
                                  note.category === 'Follow-up' ? '#ed8936' :
                                  note.category === 'Observation' ? '#4299e1' :
                                  'var(--color-text-secondary)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.625rem',
                            fontWeight: 500
                          }}>
                            {note.category}
                          </span>
                        </div>
                        <p style={{
                          margin: 0,
                          fontSize: '0.875rem',
                          color: 'var(--color-text-primary)',
                          lineHeight: 1.5,
                          whiteSpace: 'pre-wrap'
                        }}>
                          {note.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'export' && (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
              <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Export After Action Report</h3>

              <div style={{
                display: 'flex',
                gap: 'var(--spacing-lg)',
                justifyContent: 'center',
                marginBottom: 'var(--spacing-xl)'
              }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleExport('html')}
                  disabled={isExporting}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 'var(--spacing-lg)',
                    minWidth: '150px'
                  }}
                >
                  <span style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>📄</span>
                  <span style={{ fontWeight: 600 }}>HTML Report</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Print-friendly format
                  </span>
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => handleExport('json')}
                  disabled={isExporting}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 'var(--spacing-lg)',
                    minWidth: '150px'
                  }}
                >
                  <span style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>📊</span>
                  <span style={{ fontWeight: 600 }}>JSON Data</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    For analysis tools
                  </span>
                </button>
              </div>

              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                The HTML report is designed for printing or sharing as a document.<br />
                The JSON export contains structured data for further analysis.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: 'var(--spacing-md) var(--spacing-lg)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
