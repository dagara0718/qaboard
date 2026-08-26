import { useNavigate } from 'react-router-dom'
import { HeaderMain } from '../components/layout/HeaderMain'
import { Badge } from '../components/ui/Badge'
import type { Role } from '../lib/dataAccess/types'
import './MainPage.css'

interface MainPageProps {
  role: Role
  onRoleChange: (role: Role) => void
}

const STEPS = [
  {
    title: '질문 작성',
    desc: '제목과 내용을 입력하세요. 명확할수록 좋은 답변을 받을 수 있습니다.',
  },
  { title: '관리자 확인', desc: '관리자가 질문을 검토하고 답변을 준비합니다.' },
  {
    title: '답변 확인',
    desc: '신뢰할 수 있는 답변을 받으세요. 마이 페이지에서 언제든 확인 가능합니다.',
  },
]

export function MainPage({ role, onRoleChange }: MainPageProps) {
  const navigate = useNavigate()

  return (
    <div className="main-page">
      <HeaderMain role={role} onRoleChange={onRoleChange} />

      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="text-hero">
              질문은 빠르게,
              <br />
              <span className="hero-highlight">답변은 명확하게</span>
            </h1>
            <p>궁금한 점을 남기면 관리자가 확인하고 답변해드립니다.</p>
            <div className="cta-buttons">
              <button className="cta-button" onClick={() => navigate('/questions/new')}>
                질문 작성하기
              </button>
              <button className="cta-button secondary" onClick={() => navigate('/questions')}>
                내 질문 확인하기
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-card floating-card-question">
              <div className="card-label">질문</div>
              <div className="card-title">QANOW 가입 후 언제 답변을 받을 수 있나요?</div>
              <div className="card-text">
                궁금한데 회원가입하고 얼마나 빨리 답변을 받을 수 있을지 궁금합니다.
              </div>
            </div>
            <div className="floating-card floating-card-answer">
              <div className="card-label">답변</div>
              <div className="card-title">24시간 내 답변을 목표로 진행 중입니다</div>
              <div className="card-text">
                대부분의 질문은 24시간 이내에 답변하고 있습니다. 복잡한 문제는 조금 더 걸릴 수
                있습니다.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flow-section">
        <div className="flow-container">
          <h2 className="text-h2" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            어떻게 사용하나요?
          </h2>
          <div className="flow-steps">
            {STEPS.map((step, i) => (
              <div className="step" key={step.title}>
                <div className="step-number">{i + 1}</div>
                <h3 className="text-h3">{step.title}</h3>
                <p className="step-description">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="badge-showcase">
            <div className="text-h3" style={{ marginBottom: '1.5rem' }}>
              상태 배지
            </div>
            <div className="badge-group">
              <Badge status="pending" />
              <Badge status="answered" />
            </div>
          </div>
        </div>
      </section>

      <footer className="main-footer">
        <p className="footer-text">이미 계정이 있으신가요?</p>
        <a className="footer-link" href="#">
          로그인하고 내 질문 확인하기
        </a>
      </footer>
    </div>
  )
}
