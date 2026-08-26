import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeaderInternal } from '../components/layout/HeaderInternal'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { LoadingState } from '../components/states/LoadingState'
import { EmptyState } from '../components/states/EmptyState'
import { ErrorState } from '../components/states/ErrorState'
import { questionRepository } from '../lib/dataAccess'
import type { Question } from '../types/domain'
import type { Role, Session } from '../lib/dataAccess/types'
import './QuestionListPage.css'

type Filter = 'all' | 'pending' | 'answered'

interface QuestionListPageProps {
  session: Session
  onRoleChange: (role: Role) => void
  onLogout?: () => void
}

type LoadState = 'loading' | 'loaded' | 'empty' | 'error'

export function QuestionListPage({ session, onRoleChange, onLogout }: QuestionListPageProps) {
  const navigate = useNavigate()
  const isAdmin = session.role === 'admin'
  const [questions, setQuestions] = useState<Question[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [filter, setFilter] = useState<Filter>('all')

  const load = () => {
    setLoadState('loading')
    const promise = isAdmin
      ? questionRepository.listAll()
      : questionRepository.listMine(session.userId ?? '')
    promise
      .then((result) => {
        setQuestions(result)
        setLoadState(result.length === 0 ? 'empty' : 'loaded')
      })
      .catch(() => setLoadState('error'))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, session.userId])

  const filtered = questions.filter((q) => filter === 'all' || q.status === filter)

  return (
    <div>
      <HeaderInternal
        role={session.role === 'admin' ? 'admin' : 'member'}
        onRoleChange={onRoleChange}
        onLogout={onLogout}
        displayName={session.displayName}
      />
      <div className="list-container">
        <div className="page-header">
          <h1 className="text-page-title">{isAdmin ? '문의 관리' : '내 질문'}</h1>
          {!isAdmin && (
            <Button variant="primary" onClick={() => navigate('/questions/new')}>
              + 질문 작성
            </Button>
          )}
        </div>

        <div className="tabs">
          {(['all', 'pending', 'answered'] as Filter[]).map((f) => (
            <button
              key={f}
              className={`tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? '전체' : f === 'pending' ? '답변 대기' : '답변 완료'}
            </button>
          ))}
        </div>

        {loadState === 'loading' && <LoadingState />}
        {loadState === 'error' && <ErrorState onRetry={load} />}
        {loadState === 'empty' && (
          <EmptyState message={isAdmin ? '질문이 없습니다' : '작성한 질문이 없습니다'} />
        )}
        {loadState === 'loaded' && (
          <div className="question-list">
            {filtered.map((q) => (
              <div
                className="card"
                key={q.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/questions/${q.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    navigate(`/questions/${q.id}`)
                  }
                }}
              >
                <div className="text-card-title">{q.title}</div>
                <div className="card-meta">
                  <span>
                    {q.createdAt.slice(0, 10)}
                    {isAdmin && q.authorName && (
                      <span className="card-author"> · {q.authorName}</span>
                    )}
                  </span>
                  <Badge status={q.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
