import { useState, useEffect } from 'react'

type View = 'home' | 'author' | 'runner' | 'library' | 'participant'
type Role = 'facilitator' | 'participant' | null

interface HomePageProps {
  onNavigate: (view: View) => void
}

const ROLE_STORAGE_KEY = 'ctep-user-role'

export default function HomePage({ onNavigate }: HomePageProps) {
  const [role, setRole] = useState<Role>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load saved role on mount
  useEffect(() => {
    const savedRole = localStorage.getItem(ROLE_STORAGE_KEY) as Role
    if (savedRole === 'facilitator' || savedRole === 'participant') {
      setRole(savedRole)
    }
    setIsLoading(false)
  }, [])

  const handleSelectRole = (selectedRole: Role) => {
    setRole(selectedRole)
    if (selectedRole) {
      localStorage.setItem(ROLE_STORAGE_KEY, selectedRole)
    }
  }

  const handleSwitchRole = () => {
    setRole(null)
    localStorage.removeItem(ROLE_STORAGE_KEY)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="page" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'var(--color-text-muted)' }}>Loading...</div>
      </div>
    )
  }

  // Role selection screen
  if (!role) {
    return (
      <div className="page">
        <div className="page-content" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100%'
        }}>
          <div style={{ maxWidth: '700px', textAlign: 'center' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              marginBottom: 'var(--spacing-sm)'
            }}>
              CTEP Tabletop Framework
            </h1>
            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: '1.125rem',
              marginBottom: 'var(--spacing-2xl)'
            }}>
              Cybersecurity tabletop exercises based on CISA CTEP guidelines
            </p>

            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: 'var(--spacing-lg)'
            }}>
              Select Your Role
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-2xl)'
            }}>
              {/* Facilitator Option */}
              <button
                onClick={() => handleSelectRole('facilitator')}
                style={{
                  padding: 'var(--spacing-xl)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = '#4299e1'
                  e.currentTarget.style.backgroundColor = 'rgba(66, 153, 225, 0.1)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(66, 153, 225, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-md)',
                  fontSize: '2rem'
                }}>
                  🎯
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: 'var(--spacing-sm)',
                  color: 'var(--color-text-primary)'
                }}>
                  Facilitator
                </h3>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                  margin: 0
                }}>
                  Create scenarios, run exercises, manage participants, and generate reports
                </p>
              </button>

              {/* Participant Option */}
              <button
                onClick={() => handleSelectRole('participant')}
                style={{
                  padding: 'var(--spacing-xl)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = '#9f7aea'
                  e.currentTarget.style.backgroundColor = 'rgba(159, 122, 234, 0.1)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(159, 122, 234, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-md)',
                  fontSize: '2rem'
                }}>
                  👤
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: 'var(--spacing-sm)',
                  color: 'var(--color-text-primary)'
                }}>
                  Participant
                </h3>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                  margin: 0
                }}>
                  Open exercise packages, review scenarios, and submit responses
                </p>
              </button>
            </div>

            <p style={{
              color: 'var(--color-text-muted)',
              fontSize: '0.875rem'
            }}>
              Your selection will be remembered. You can switch roles anytime.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Facilitator Home
  if (role === 'facilitator') {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">CTEP Tabletop Framework</h1>
          <button
            className="btn btn-ghost"
            onClick={handleSwitchRole}
            style={{ fontSize: '0.875rem' }}
          >
            Switch Role
          </button>
        </div>

        <div className="page-content">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-xs) var(--spacing-md)',
                backgroundColor: 'rgba(66, 153, 225, 0.1)',
                borderRadius: 'var(--radius-full)',
                marginBottom: 'var(--spacing-md)'
              }}>
                <span>🎯</span>
                <span style={{ color: '#4299e1', fontWeight: 500 }}>Facilitator Mode</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 'var(--spacing-md)' }}>
                Exercise Management
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
                Create, customize, and run tabletop exercises for your security team.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--spacing-lg)'
            }}>
              {/* Create Scenario Card */}
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('author')}>
                <div className="card-header">
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(66, 153, 225, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--spacing-md)',
                    fontSize: '1.5rem'
                  }}>
                    +
                  </div>
                  <h3 className="card-title">Create Scenario</h3>
                  <p className="card-description">
                    Build a custom tabletop exercise with modules, injects, and discussion questions.
                  </p>
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }}>
                  New Scenario
                </button>
              </div>

              {/* Run Exercise Card */}
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('runner')}>
                <div className="card-header">
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(72, 187, 120, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--spacing-md)',
                    fontSize: '1.5rem'
                  }}>
                    ▶
                  </div>
                  <h3 className="card-title">Run Exercise</h3>
                  <p className="card-description">
                    Facilitate a tabletop exercise with your team using an existing scenario.
                  </p>
                </div>
                <button className="btn btn-secondary" style={{ width: '100%' }}>
                  Open Exercise
                </button>
              </div>

              {/* Library Card */}
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('library')}>
                <div className="card-header">
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(237, 137, 54, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--spacing-md)',
                    fontSize: '1.5rem'
                  }}>
                    📚
                  </div>
                  <h3 className="card-title">Scenario Library</h3>
                  <p className="card-description">
                    Browse templates and example scenarios for ransomware, phishing, and more.
                  </p>
                </div>
                <button className="btn btn-secondary" style={{ width: '100%' }}>
                  Browse Library
                </button>
              </div>
            </div>

            {/* Quick Info Section */}
            <div style={{
              marginTop: 'var(--spacing-2xl)',
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)'
            }}>
              <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 600 }}>
                Facilitator Workflow
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--spacing-md)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--spacing-sm)'
                }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    flexShrink: 0
                  }}>1</span>
                  <div>
                    <strong>Create or Select</strong>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
                      Build a custom scenario or use a template
                    </p>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--spacing-sm)'
                }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    flexShrink: 0
                  }}>2</span>
                  <div>
                    <strong>Export Packages</strong>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
                      Send participant packages to your team
                    </p>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--spacing-sm)'
                }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    flexShrink: 0
                  }}>3</span>
                  <div>
                    <strong>Run & Collect</strong>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
                      Facilitate exercise and import responses
                    </p>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--spacing-sm)'
                }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    flexShrink: 0
                  }}>4</span>
                  <div>
                    <strong>Generate AAR</strong>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
                      Create after-action report
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Participant Home
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">CTEP Tabletop Framework</h1>
        <button
          className="btn btn-ghost"
          onClick={handleSwitchRole}
          style={{ fontSize: '0.875rem' }}
        >
          Switch Role
        </button>
      </div>

      <div className="page-content">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-xs) var(--spacing-md)',
              backgroundColor: 'rgba(159, 122, 234, 0.1)',
              borderRadius: 'var(--radius-full)',
              marginBottom: 'var(--spacing-md)'
            }}>
              <span>👤</span>
              <span style={{ color: '#9f7aea', fontWeight: 500 }}>Participant Mode</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 'var(--spacing-md)' }}>
              Exercise Participation
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
              Open your participant package to review the scenario and submit responses.
            </p>
          </div>

          {/* Main Action Card */}
          <div
            className="card"
            style={{
              cursor: 'pointer',
              textAlign: 'center',
              padding: 'var(--spacing-xl)'
            }}
            onClick={() => onNavigate('participant')}
          >
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(159, 122, 234, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-lg)',
              fontSize: '2.5rem'
            }}>
              📥
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
              Open Participant Package
            </h3>
            <p style={{
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              Load the .ctep-participant.json file provided by your facilitator
            </p>
            <button className="btn btn-primary" style={{ minWidth: '200px' }}>
              Open Package
            </button>
          </div>

          {/* Instructions */}
          <div style={{
            marginTop: 'var(--spacing-xl)',
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)'
          }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 600 }}>
              How It Works
            </h3>
            <ol style={{
              color: 'var(--color-text-secondary)',
              paddingLeft: 'var(--spacing-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-sm)',
              margin: 0
            }}>
              <li>Your facilitator will send you a participant package file (.ctep-participant.json)</li>
              <li>Click "Open Package" above to load the exercise scenario</li>
              <li>Review the situation and injects at your own pace</li>
              <li>Answer the discussion questions thoughtfully</li>
              <li>Export your responses and send them back to the facilitator</li>
            </ol>
          </div>

          {/* Note about facilitator notes */}
          <div style={{
            marginTop: 'var(--spacing-md)',
            padding: 'var(--spacing-md)',
            backgroundColor: 'rgba(66, 153, 225, 0.1)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)'
          }}>
            <strong>Note:</strong> Participant packages contain the scenario content needed for the exercise.
            Facilitator notes and expected responses are not included to preserve exercise integrity.
          </div>
        </div>
      </div>
    </div>
  )
}
