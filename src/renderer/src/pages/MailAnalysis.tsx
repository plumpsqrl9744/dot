import { FiMail, FiCpu, FiCheck, FiX, FiAlertCircle, FiInbox } from 'react-icons/fi'
import { Button, Card, Breadcrumb, Badge, Dot, FilterTabs } from '@renderer/shared/components'
import { useMail, useToasts } from '../store'
import type { MailAnalysis as MailAnalysisType, MailFilter, MailImportance } from '../types'

const importanceBadgeVariant: Record<MailImportance, 'red' | 'orange' | 'green'> = {
  high: 'red',
  medium: 'orange',
  low: 'green'
}

const filterTabOptions: { value: MailFilter; label: string }[] = [
  { value: 'pending', label: '미확인' },
  { value: 'approved', label: '승인됨' },
  { value: 'dismissed', label: '무시됨' },
  { value: 'all', label: '전체' }
]

function MailCard({
  mail,
  onApprove,
  onDismiss
}: {
  mail: MailAnalysisType
  onApprove: (id: string) => void
  onDismiss: (id: string) => void
}): React.JSX.Element {
  const isActioned = mail.reviewStatus !== 'pending'

  return (
    <Card>
      <div className="space-y-3">
        {/* 상단: 메일 제목 + 발신자 + 수신 시간 */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {mail.subject}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {mail.sender} &lt;{mail.senderEmail}&gt; · {mail.receivedAt}
            </p>
          </div>
          {isActioned && (
            <Badge
              label={mail.reviewStatus === 'approved' ? 'Approved' : 'Dismissed'}
              variant={mail.reviewStatus === 'approved' ? 'green' : 'gray'}
              size="sm"
              uppercase={false}
            />
          )}
        </div>

        {/* 중단: 메일 본문 미리보기 */}
        <div className="bg-[var(--bg-secondary)] rounded-md px-3 py-2.5 border-l-2 border-[var(--border-default)]">
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
            {mail.bodyPreview}
          </p>
        </div>

        {/* LLM 제안 영역 */}
        {mail.needed ? (
          <div className="bg-[var(--primary-bg)] rounded-md px-3 py-2.5">
            <div className="flex items-center gap-2 mb-1.5">
              <FiCpu size={12} className="text-[var(--primary)]" />
              <span className="text-[10px] font-semibold text-[var(--primary)] uppercase tracking-wide">
                AI 제안
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {mail.suggestedTitle}
              </span>
              <Badge
                label={mail.importance}
                variant={importanceBadgeVariant[mail.importance]}
                size="sm"
              />
              <Badge label={mail.category} size="sm" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <FiCheck size={12} />
            <span>할 일 없음</span>
          </div>
        )}

        {/* 하단 액션 */}
        {!isActioned && (
          <div className="flex items-center gap-2 pt-1">
            <Button
              size="xs"
              variant="primary"
              icon={<FiCheck size={12} />}
              onClick={() => onApprove(mail.id)}
            >
              태스크 추가
            </Button>
            <Button
              size="xs"
              variant="ghost"
              icon={<FiX size={12} />}
              onClick={() => onDismiss(mail.id)}
            >
              무시
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

export function MailAnalysis(): React.JSX.Element {
  const {
    mailAnalyses,
    mailFilter,
    analysisStatus,
    mailConnection,
    setMailFilter,
    setAnalysisStatus,
    approveAnalysis,
    dismissAnalysis
  } = useMail()

  const { success } = useToasts()

  // 필터링
  const filteredMails =
    mailFilter === 'all'
      ? mailAnalyses
      : mailAnalyses.filter((m) => m.reviewStatus === mailFilter)

  // 탭별 개수 계산
  const counts: Record<MailFilter, number> = {
    pending: mailAnalyses.filter((m) => m.reviewStatus === 'pending').length,
    approved: mailAnalyses.filter((m) => m.reviewStatus === 'approved').length,
    dismissed: mailAnalyses.filter((m) => m.reviewStatus === 'dismissed').length,
    all: mailAnalyses.length
  }

  const tabOptions = filterTabOptions.map((opt) => ({
    ...opt,
    count: counts[opt.value]
  }))

  const handleAnalyzeNow = (): void => {
    setAnalysisStatus('analyzing')
    setTimeout(() => {
      setAnalysisStatus('idle')
      success('분석 완료')
    }, 2000)
  }

  const handleApprove = (id: string): void => {
    approveAnalysis(id)
    success('태스크가 추가되었습니다.')
  }

  const handleDismiss = (id: string): void => {
    dismissAnalysis(id)
  }

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="max-w-[1200px] mx-auto px-8 py-5 space-y-5">
        {/* 1. Breadcrumb + Header */}
        <Breadcrumb items={[{ label: 'Mail Analysis' }]} />

        <header>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Mail Analysis</h1>
          <p className="text-sm text-[var(--text-placeholder)] mt-1">
            AI가 분석한 메일 기반 태스크 후보
          </p>
        </header>

        {/* 2. 상태 바 */}
        <Card>
          <div className="flex items-center justify-between">
            {/* 좌측: 연결 상태 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FiMail size={14} className="text-[var(--text-muted)]" />
                <Dot
                  color={mailConnection.isConnected ? 'success' : 'error'}
                  size="sm"
                  pulse={mailConnection.isConnected}
                />
                <span className="text-sm text-[var(--text-secondary)]">
                  {mailConnection.isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {mailConnection.lastSyncAt && (
                <span className="text-xs text-[var(--text-muted)]">
                  마지막 동기화: {mailConnection.lastSyncAt}
                </span>
              )}
            </div>

            {/* 우측: 분석 상태 + Ollama */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {analysisStatus === 'idle' && (
                  <>
                    <Dot color="success" size="sm" />
                    <span className="text-xs text-[var(--text-secondary)]">Ready</span>
                  </>
                )}
                {analysisStatus === 'analyzing' && (
                  <>
                    <svg
                      className="animate-spin h-3 w-3 text-[var(--primary)]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span className="text-xs text-[var(--primary)]">분석 중...</span>
                  </>
                )}
                {analysisStatus === 'error' && (
                  <>
                    <FiAlertCircle size={12} className="text-[var(--error)]" />
                    <span className="text-xs text-[var(--error)]">오류</span>
                  </>
                )}
              </div>
              <div className="h-4 w-px bg-[var(--border-default)]" />
              <div className="flex items-center gap-1.5">
                <FiCpu size={12} className="text-[var(--text-muted)]" />
                <span className="text-xs text-[var(--text-muted)]">Qwen2.5 3B · Ready</span>
              </div>
              <div className="h-4 w-px bg-[var(--border-default)]" />
              <button
                onClick={handleAnalyzeNow}
                disabled={analysisStatus === 'analyzing'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  analysisStatus === 'analyzing'
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed'
                    : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]'
                }`}
              >
                {analysisStatus === 'analyzing' ? (
                  <svg
                    className="animate-spin h-3 w-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  <FiCpu size={12} />
                )}
                {analysisStatus === 'analyzing' ? '분석 중...' : '지금 분석하기'}
              </button>
            </div>
          </div>
        </Card>

        {/* 3. FilterTabs */}
        <FilterTabs<MailFilter> options={tabOptions} value={mailFilter} onChange={setMailFilter} />

        {/* 4. 메일 분석 카드 리스트 */}
        {filteredMails.length > 0 ? (
          <div className="space-y-3">
            {filteredMails.map((mail) => (
              <MailCard
                key={mail.id}
                mail={mail}
                onApprove={handleApprove}
                onDismiss={handleDismiss}
              />
            ))}
          </div>
        ) : (
          /* 5. 빈 상태 */
          <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
            <FiInbox size={40} strokeWidth={1} className="mb-3 opacity-50" />
            <p className="text-sm">분석된 메일이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}
