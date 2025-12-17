import { useEffect, useRef } from 'react'
import type { TimingStatus } from '../../types/exercise.types'

interface TimerProps {
  elapsedSeconds: number
  isRunning: boolean
  label?: string
  size?: 'small' | 'large'
  suggestedDurationMinutes?: number
  showWarnings?: boolean
  onExtendTime?: (minutes: number) => void
}

function getTimingStatus(
  elapsedSeconds: number,
  suggestedDurationMinutes?: number
): TimingStatus {
  if (!suggestedDurationMinutes) return 'on_track'

  const suggestedSeconds = suggestedDurationMinutes * 60
  const percentUsed = (elapsedSeconds / suggestedSeconds) * 100

  if (percentUsed >= 100) return 'overtime'
  if (percentUsed >= 80) return 'warning'
  return 'on_track'
}

function getStatusColor(status: TimingStatus): string {
  switch (status) {
    case 'on_track': return 'var(--color-severity-low)'
    case 'warning': return 'var(--color-severity-medium)'
    case 'overtime': return 'var(--color-severity-critical)'
  }
}

function getStatusLabel(status: TimingStatus): string {
  switch (status) {
    case 'on_track': return 'On Track'
    case 'warning': return 'Time Warning'
    case 'overtime': return 'Overtime'
  }
}

export default function Timer({
  elapsedSeconds,
  isRunning,
  label,
  size = 'small',
  suggestedDurationMinutes,
  showWarnings = false,
  onExtendTime
}: TimerProps) {
  const hours = Math.floor(elapsedSeconds / 3600)
  const minutes = Math.floor((elapsedSeconds % 3600) / 60)
  const seconds = elapsedSeconds % 60
  const prevStatusRef = useRef<TimingStatus>('on_track')

  const timingStatus = getTimingStatus(elapsedSeconds, suggestedDurationMinutes)
  const statusColor = getStatusColor(timingStatus)

  // Play audio chime when status changes to warning or overtime
  useEffect(() => {
    if (!showWarnings) return

    // Detect status change
    if (prevStatusRef.current !== timingStatus) {
      if (timingStatus === 'warning' || timingStatus === 'overtime') {
        // Play a subtle audio chime using Web Audio API
        try {
          const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.value = timingStatus === 'overtime' ? 440 : 660
          oscillator.type = 'sine'

          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.3)
        } catch {
          // Audio not supported or blocked
        }
      }
      prevStatusRef.current = timingStatus
    }
  }, [timingStatus, showWarnings])

  const formatTime = () => {
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatDuration = (totalMinutes: number) => {
    if (totalMinutes >= 60) {
      const h = Math.floor(totalMinutes / 60)
      const m = totalMinutes % 60
      return `${h}h ${m}m`
    }
    return `${totalMinutes}m`
  }

  const isLarge = size === 'large'
  const showStatus = showWarnings && suggestedDurationMinutes && timingStatus !== 'on_track'

  // Calculate progress percentage
  const progressPercent = suggestedDurationMinutes
    ? Math.min((elapsedSeconds / (suggestedDurationMinutes * 60)) * 100, 100)
    : 0

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
        color: showWarnings && suggestedDurationMinutes
          ? statusColor
          : (isRunning ? 'var(--color-text-primary)' : 'var(--color-text-muted)'),
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-xs)',
        animation: timingStatus === 'overtime' && isRunning ? 'timerPulse 1s ease-in-out infinite' : undefined
      }}>
        {isRunning && (
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: showWarnings && suggestedDurationMinutes
              ? statusColor
              : 'var(--color-accent-danger)',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
        )}
        {formatTime()}
      </div>

      {/* Progress bar and status indicator */}
      {showWarnings && suggestedDurationMinutes && (
        <div style={{ width: '100%', marginTop: 'var(--spacing-xs)' }}>
          {/* Progress bar */}
          <div style={{
            height: '4px',
            backgroundColor: 'var(--color-bg-tertiary)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            marginBottom: '4px'
          }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: statusColor,
              transition: 'width 0.3s ease, background-color 0.3s ease'
            }} />
          </div>

          {/* Duration info */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.625rem'
          }}>
            <span style={{ color: 'var(--color-text-muted)' }}>
              / {formatDuration(suggestedDurationMinutes)}
            </span>
            {showStatus && (
              <span style={{
                color: statusColor,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {timingStatus === 'warning' && '⚠️'}
                {timingStatus === 'overtime' && '🔴'}
                {getStatusLabel(timingStatus)}
              </span>
            )}
          </div>

          {/* Extend Time button for overtime */}
          {timingStatus === 'overtime' && onExtendTime && (
            <button
              onClick={() => onExtendTime(5)}
              style={{
                marginTop: 'var(--spacing-xs)',
                padding: '4px 8px',
                fontSize: '0.625rem',
                backgroundColor: 'transparent',
                border: `1px solid ${statusColor}`,
                borderRadius: 'var(--radius-sm)',
                color: statusColor,
                cursor: 'pointer',
                width: '100%'
              }}
            >
              + 5 min
            </button>
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes timerPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
