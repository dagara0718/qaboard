import './Badge.css'

type Status = 'pending' | 'answered' | 'admin'

const CONFIG: Record<Status, { symbol: string; label: string; className: string }> = {
  pending: { symbol: '●', label: '답변 대기 중', className: 'badge-waiting' },
  answered: { symbol: '✓', label: '답변됨', className: 'badge-answered' },
  admin: { symbol: '■', label: '관리자', className: 'badge-admin' },
}

interface BadgeProps {
  status: Status
}

/** 색상만으로 상태를 전달하지 않도록 기호+텍스트를 항상 함께 렌더링한다 (Constitution IX). */
export function Badge({ status }: BadgeProps) {
  const { symbol, label, className } = CONFIG[status]
  return (
    <span className={`badge ${className}`}>
      {symbol && <span aria-hidden="true">{symbol} </span>}
      {label}
    </span>
  )
}
