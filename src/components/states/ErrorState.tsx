import { Button } from '../ui/Button'
import './States.css'

interface ErrorStateProps {
  message?: string
  onRetry: () => void
}

export function ErrorState({
  message = '목록을 불러오지 못했습니다. 네트워크 오류가 발생했습니다.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="state-panel" role="alert">
      <div className="state-icon" aria-hidden="true">
        ⚠️
      </div>
      <div className="state-title">{message}</div>
      <div className="state-desc" style={{ marginTop: '1rem' }}>
        <Button variant="secondary" onClick={onRetry}>
          다시 시도
        </Button>
      </div>
    </div>
  )
}
