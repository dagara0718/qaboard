import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { HeaderInternal } from '../components/layout/HeaderInternal'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { LoadingState } from '../components/states/LoadingState'
import { ErrorState } from '../components/states/ErrorState'
import { UnauthorizedToast } from '../components/states/UnauthorizedToast'
import { answerRepository, questionRepository } from '../lib/dataAccess'
import { RepositoryError } from '../lib/dataAccess/types'
import type { Answer, Question } from '../types/domain'
import type { Role, Session } from '../lib/dataAccess/types'
import './QuestionDetailPage.css'

interface QuestionDetailPageProps {
  session: Session
  onRoleChange: (role: Role) => void
  onLogout?: () => void
}

type Load = 'loading' | 'loaded' | 'error'
type Mode = 'view' | 'editQuestion' | 'answerForm'

export function QuestionDetailPage({ session, onRoleChange, onLogout }: QuestionDetailPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const isAdmin = session.role === 'admin'

  const [question, setQuestion] = useState<Question | null>(null)
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [loadState, setLoadState] = useState<Load>(isNew ? 'loaded' : 'loading')
  const [mode, setMode] = useState<Mode>(isNew ? 'editQuestion' : 'view')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [answerText, setAnswerText] = useState('')
  const [fieldError, setFieldError] = useState<string | undefined>()
  const [toast, setToast] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    if (isNew || !id) return
    setLoadState('loading')
    Promise.all([questionRepository.getById(id), answerRepository.getByQuestionId(id)])
      .then(([q, a]) => {
        setQuestion(q)
        setAnswer(a)
        setLoadState('loaded')
      })
      .catch(() => setLoadState('error'))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const startEditQuestion = () => {
    if (!question) return
    setTitle(question.title)
    setContent(question.content)
    setFieldError(undefined)
    setMode('editQuestion')
  }

  const submitQuestion = async () => {
    setFieldError(undefined)
    if (title.trim().length === 0) {
      setFieldError('제목을 입력해주세요')
      return
    }
    setSaving(true)
    try {
      if (isNew) {
        await questionRepository.create(session.userId ?? '', { title, content })
        navigate('/questions')
      } else if (question) {
        const updated = await questionRepository.update(question.id, session.userId ?? '', {
          title,
          content,
        })
        setQuestion(updated)
        setMode('view')
      }
    } catch (e) {
      if (e instanceof RepositoryError) setToast(e.message)
    } finally {
      setSaving(false)
    }
  }

  const submitDelete = async () => {
    if (!question) return
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    try {
      await questionRepository.remove(question.id, session.userId ?? '')
      navigate('/questions')
    } catch (e) {
      if (e instanceof RepositoryError) setToast(e.message)
    }
  }

  const startAnswer = (existing?: Answer) => {
    setAnswerText(existing?.content ?? '')
    setFieldError(undefined)
    setMode('answerForm')
  }

  const submitAnswer = async () => {
    if (!question) return
    setFieldError(undefined)
    if (answerText.trim().length === 0) {
      setFieldError('답변 내용을 입력해주세요 (1자 이상)')
      return
    }
    setSaving(true)
    try {
      if (answer) {
        const updated = await answerRepository.update(
          answer.id,
          session.userId ?? '',
          answerText,
        )
        setAnswer(updated)
      } else {
        const created = await answerRepository.create(
          question.id,
          session.userId ?? '',
          // design.md는 관리자 개인 식별 정보를 노출하지 않고 항상 "관리자"로만 표시한다
          // (실 인증 모드의 session.displayName은 이메일이라 그대로 쓰면 개인정보가 노출된다).
          '관리자',
          answerText,
        )
        setAnswer(created)
        setQuestion({ ...question, status: 'answered' })
      }
      setMode('view')
    } catch (e) {
      if (e instanceof RepositoryError) setToast(e.message)
    } finally {
      setSaving(false)
    }
  }

  const canEditQuestion =
    !isAdmin && question?.userId === session.userId && question?.status === 'pending'

  // FR-013: 관리자는 질문을 작성할 수 없다 — "+질문 작성" 버튼이 숨겨지지만 URL 직접 접근은 별도 차단 필요
  if (isAdmin && isNew) {
    return <Navigate to="/questions" replace />
  }

  return (
    <div>
      <HeaderInternal
        role={isAdmin ? 'admin' : 'member'}
        onRoleChange={onRoleChange}
        onLogout={onLogout}
        displayName={session.displayName}
        showBack
      />
      <div className="detail-container">
        {!isNew && loadState === 'loading' && <LoadingState rows={1} />}
        {!isNew && loadState === 'error' && <ErrorState onRetry={load} />}

        {(isNew || loadState === 'loaded') && (
          <>
            {mode === 'view' && question && (
              <>
                <section className="section">
                  <div className="text-section-label">질문</div>
                  <h1 className="text-question-title">{question.title}</h1>
                  <div className="question-meta">
                    <span>작성일: {question.createdAt.slice(0, 10)}</span>
                    {isAdmin && question.authorName && <span>작성자: {question.authorName}</span>}
                    <Badge status={question.status} />
                  </div>
                  <p className="text-body">{question.content}</p>
                  {canEditQuestion && (
                    <div className="action-buttons">
                      <Button variant="secondary" onClick={startEditQuestion}>
                        수정
                      </Button>
                      <Button variant="danger" onClick={submitDelete}>
                        삭제
                      </Button>
                    </div>
                  )}
                </section>

                <section className="section answer-section">
                  <div className="text-section-label">답변</div>
                  {answer ? (
                    <div className="answer-box">
                      <div className="text-small">
                        {answer.adminName} · {answer.createdAt.slice(0, 10)}
                      </div>
                      <p className="text-body">{answer.content}</p>
                      {isAdmin && answer.adminId === session.userId && (
                        <div className="answer-edit-link">
                          <Button variant="secondary" onClick={() => startAnswer(answer)}>
                            답변 수정
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : isAdmin ? (
                    <Button variant="primary" onClick={() => startAnswer()}>
                      답변 작성
                    </Button>
                  ) : (
                    <div className="waiting-notice">관리자가 확인 후 답변할 예정입니다.</div>
                  )}
                </section>
              </>
            )}

            {mode === 'editQuestion' && (
              <section className="section">
                <div className="text-section-label">{isNew ? '새 질문 작성' : '질문 수정'}</div>
                <Input
                  id="title"
                  label="제목"
                  maxLength={100}
                  placeholder="질문 제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={fieldError}
                />
                <Textarea
                  id="content"
                  label="내용"
                  maxLength={5000}
                  placeholder="질문 내용을 자세히 입력하세요"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="submit-buttons">
                  <Button variant="primary" onClick={submitQuestion} disabled={saving}>
                    {saving ? '저장 중...' : isNew ? '작성' : '저장'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => (isNew ? navigate('/questions') : setMode('view'))}
                  >
                    취소
                  </Button>
                </div>
              </section>
            )}

            {mode === 'answerForm' && question && (
              <>
                <section className="section">
                  <div className="text-section-label">질문</div>
                  <h1 className="text-question-title">{question.title}</h1>
                  <p className="text-body">{question.content}</p>
                </section>
                <section className="section answer-section">
                  <div className="text-section-label">{answer ? '답변 수정' : '답변 작성'}</div>
                  <Textarea
                    id="answer"
                    label="답변"
                    maxLength={5000}
                    placeholder="답변을 입력하세요"
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    error={fieldError}
                  />
                  <div className="submit-buttons">
                    <Button variant="primary" onClick={submitAnswer} disabled={saving}>
                      {saving ? '저장 중...' : '저장'}
                    </Button>
                    <Button variant="secondary" onClick={() => setMode('view')}>
                      취소
                    </Button>
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </div>
      {toast && <UnauthorizedToast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  )
}
