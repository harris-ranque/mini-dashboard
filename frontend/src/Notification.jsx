import { useCallback, useEffect, useState } from 'react'
import './Notification.css'

export function NotificationContainer({ notifications, onDismiss }) {
  if (notifications.length === 0) return null

  return (
    <div className="notifications" aria-live="polite" aria-atomic="false">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  )
}

function NotificationToast({ notification, onDismiss }) {
  const { id, message, type } = notification

  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(id), notification.duration)
    return () => window.clearTimeout(timer)
  }, [id, notification.duration, onDismiss])

  return (
    <div
      className={`notification notification--${type}`}
      role="status"
    >
      <span className="notification__icon" aria-hidden>
        {type === 'success' ? '✓' : '!'}
      </span>
      <p className="notification__message">{message}</p>
      <button
        type="button"
        className="notification__close"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  )
}

export function useNotifications(defaultDuration = 4000) {
  const [notifications, setNotifications] = useState([])

  const dismiss = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const notify = useCallback(
    (message, type = 'success', duration = defaultDuration) => {
      const id = crypto.randomUUID()
      setNotifications((prev) => [...prev, { id, message, type, duration }])
    },
    [defaultDuration],
  )

  return { notifications, notify, dismiss }
}
