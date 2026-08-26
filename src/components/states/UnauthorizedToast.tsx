import { useEffect } from 'react'
import './States.css'

interface UnauthorizedToastProps {
  message: string
  onDismiss: () => void
}

/** FR-026: 권한 없음 오류는 Toast로 표시하고 3초 후 자동으로 사라진다. */
export function UnauthorizedToast({ message, onDismiss }: UnauthorizedToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="toast" role="alert">
      {message}
    </div>
  )
}
