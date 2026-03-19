import { JSX } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { EventClickArg } from '@fullcalendar/core'
import { FiPlus } from 'react-icons/fi'
import { Button, Dot, Breadcrumb } from '@renderer/shared/components'
import './Calendar.css'

interface CalendarProps {
  onEventClick?: (eventId: string) => void
}

const sampleEvents = [
  { id: '1', title: 'AMS 정기 미팅', start: '2026-03-19', backgroundColor: 'rgb(99, 102, 241)' },
  { id: '2', title: 'WAS 배포', start: '2026-03-20', backgroundColor: 'rgb(236, 72, 153)' },
  {
    id: '3',
    title: 'Frontend 코드리뷰',
    start: '2026-03-21',
    backgroundColor: 'rgb(14, 165, 233)'
  },
  {
    id: '4',
    title: 'DB 마이그레이션',
    start: '2026-03-24',
    end: '2026-03-26',
    backgroundColor: 'rgb(245, 158, 11)'
  },
  { id: '5', title: 'QA 테스트', start: '2026-03-25', backgroundColor: 'rgb(20, 184, 166)' },
  { id: '6', title: '스프린트 회고', start: '2026-03-28', backgroundColor: 'rgb(168, 85, 247)' }
]

export function Calendar({ onEventClick }: CalendarProps): JSX.Element {
  const today = new Date()
  const dateString = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long'
  })

  const handleEventClick = (info: EventClickArg): void => {
    const eventId = info.event.id
    if (eventId && onEventClick) {
      onEventClick(eventId)
    }
  }

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="max-w-[1200px] mx-auto px-8 py-5 space-y-5">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Calendar' }]} />

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Calendar</h1>
            <p className="text-sm text-text-placeholder mt-1">{dateString}</p>
          </div>
          <Button icon={<FiPlus size={12} strokeWidth={2.5} />}>New Event</Button>
        </header>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <span className="text-text-muted">Projects:</span>
          <div className="flex items-center gap-1.5">
            <Dot color="rgb(99,102,241)" size="md" />
            <span>AMS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Dot color="rgb(236,72,153)" size="md" />
            <span>WAS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Dot color="rgb(14,165,233)" size="md" />
            <span>Frontend</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Dot color="rgb(245,158,11)" size="md" />
            <span>DB</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Dot color="rgb(20,184,166)" size="md" />
            <span>QA</span>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-bg-default rounded-lg border border-[var(--border-default)] p-4">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            locale="ko"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek'
            }}
            buttonText={{
              today: '오늘',
              month: '월',
              week: '주'
            }}
            events={sampleEvents}
            eventClick={handleEventClick}
            eventDisplay="block"
            dayMaxEvents={3}
            moreLinkText={(num) => `+${num}`}
            height={600}
            fixedWeekCount={true}
          />
        </div>
      </div>
    </div>
  )
}
