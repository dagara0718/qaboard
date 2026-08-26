import './States.css'

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="state-panel">
      <div className="state-icon" aria-hidden="true">
        📭
      </div>
      <div className="state-title">{message}</div>
    </div>
  )
}
