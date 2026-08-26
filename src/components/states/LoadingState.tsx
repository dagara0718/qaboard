import './States.css'

export function LoadingState({ rows = 3 }: { rows?: number }) {
  return (
    <div role="status" aria-live="polite" aria-label="목록을 불러오는 중">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="skeleton-row" key={i}>
          <div className="skeleton-bar title" />
          <div className="skeleton-bar meta" />
        </div>
      ))}
    </div>
  )
}
