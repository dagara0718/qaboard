import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from '../../src/components/ui/Badge'

describe('Badge', () => {
  it('상태를 색상뿐 아니라 텍스트로도 표시한다 (Constitution IX)', () => {
    render(<Badge status="pending" />)
    expect(screen.getByText('답변 대기 중')).toBeInTheDocument()
  })

  it('답변완료 배지는 별도 문구를 표시한다', () => {
    render(<Badge status="answered" />)
    expect(screen.getByText('답변됨')).toBeInTheDocument()
  })
})
