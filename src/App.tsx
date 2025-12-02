import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import ScenarioAuthorPage from './pages/ScenarioAuthorPage'
import ExerciseRunnerPage from './pages/ExerciseRunnerPage'
import LibraryPage from './pages/LibraryPage'
import ParticipantPortalPage from './pages/ParticipantPortalPage'

type View = 'home' | 'author' | 'runner' | 'library' | 'participant'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home')

  useEffect(() => {
    // Listen for menu events - each returns a cleanup function
    const cleanupFns: (() => void)[] = []

    if (window.electronAPI) {
      cleanupFns.push(window.electronAPI.onMenuViewEditor(() => setCurrentView('author')))
      cleanupFns.push(window.electronAPI.onMenuViewRunner(() => setCurrentView('runner')))
      cleanupFns.push(window.electronAPI.onMenuViewLibrary(() => setCurrentView('library')))
      cleanupFns.push(window.electronAPI.onMenuNewScenario(() => setCurrentView('author')))
    }

    return () => {
      // Cleanup listeners using returned cleanup functions
      cleanupFns.forEach(cleanup => cleanup())
    }
  }, [])

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={setCurrentView} />
      case 'author':
        return <ScenarioAuthorPage onNavigate={setCurrentView} />
      case 'runner':
        return <ExerciseRunnerPage onNavigate={setCurrentView} />
      case 'library':
        return <LibraryPage onNavigate={setCurrentView} />
      case 'participant':
        return <ParticipantPortalPage onNavigate={setCurrentView} />
      default:
        return <HomePage onNavigate={setCurrentView} />
    }
  }

  return (
    <div className="app">
      {renderView()}
    </div>
  )
}
