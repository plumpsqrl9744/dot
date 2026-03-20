// 시간 관련 유틸리티 함수

/**
 * 24시간 형식 시간 문자열을 12시간 형식으로 파싱
 */
export function parseTime(timeStr: string): {
  ampm: '오전' | '오후'
  hour: string
  minute: string
} {
  const [hStr, mStr] = timeStr.split(':')
  let h = parseInt(hStr, 10)
  const ampm = h >= 12 ? '오후' : '오전'
  if (h === 0) h = 12
  else if (h > 12) h -= 12
  return {
    ampm: ampm as '오전' | '오후',
    hour: String(h).padStart(2, '0'),
    minute: mStr || '00'
  }
}

/**
 * 12시간 형식을 24시간 형식 문자열로 변환
 */
export function formatTime(ampm: '오전' | '오후', hour: string, minute: string): string {
  let h = parseInt(hour, 10)
  if (ampm === '오후' && h < 12) h += 12
  if (ampm === '오전' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${minute}`
}
