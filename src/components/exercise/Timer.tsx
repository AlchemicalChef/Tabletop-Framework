interface TimerProps {
  elapsedSeconds: number
  isRunning: boolean
  label?: string
  size?: 'small' | 'large'
}

export default function Timer({ elapsedSeconds, isRunning, label, size = 'small' }: TimerProps) {
  const hours = Math.floor(elapsedSeconds / 3600)
  const minutes = Math.floor((elapsedSeconds % 3600) / 60)
  const seconds = elapsedSeconds % 60

  const formatTime = () => {
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const isLarge = size === 'large'

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isLarge ? 'center' : 'flex-start'
    }}>
      {label && (
        <span style={{
          fontSize: '0.625rem',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '2px'
        }}>
          {label}
        </span>
      )}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: isLarge ? '2rem' : '1rem',
        fontWeight: 600,
        color: isRunning ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-xs)'
      }}>
        {isRunning && (
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-accent-danger)',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
        )}
        {formatTime()}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
