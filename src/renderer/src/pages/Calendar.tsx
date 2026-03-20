import { JSX, useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { EventClickArg } from '@fullcalendar/core'
import { FiPlus } from 'react-icons/fi'
import { Button, Dot, Breadcrumb } from '@renderer/shared/components'
import { CALENDAR_EVENTS } from '../constants'
import { useTasks } from '../store'
import { isTaskCompleted } from '../types'
import './Calendar.css'

interface CalendarProps {
  onEventClick?: (eventId: string) => void
  onCreateTask?: () => void
}

const TAG_COLORS: Record<string, string> = {
  AMS: 'rgb(99, 102, 241)',
  WAS: 'rgb(236, 72, 153)',
  FRONTEND: 'rgb(14, 165, 233)',
  BACKEND: 'rgb(14, 165, 233)',
  BIZ: 'rgb(245, 158, 11)',
  QA: 'rgb(20, 184, 166)',
  MARKETING: 'rgb(168, 85, 247)',
  DEVOPS: 'rgb(245, 158, 11)',
  PERSONAL: 'rgb(156, 163, 175)'
}

export function Calendar({ onEventClick, onCreateTask }: CalendarProps): JSX.Element {
  const { tasks } = useTasks()

  const calendarEvents = useMemo(() => {
    // 태스크 기반 이벤트: dueDate가 있는 태스크들을 캘린더 이벤트로 변환
    const taskEvents = tasks
      .filter((t) => t.createdAt && !isTaskCompleted(t))
      .map((t) => ({
        id: t.id,
        title: t.title,
        start: t.createdAt!,
        backgroundColor: TAG_COLORS[t.tag || ''] || 'rgb(156, 163, 175)',
        extendedProps: { taskId: t.id }
      }))

    // 캘린더 고유 이벤트 (태스크와 매핑되지 않는 것만 추가)
    const taskIds = new Set(taskEvents.map((e) => e.id))
    const additionalEvents = CALENDAR_EVENTS.filter((e) => !taskIds.has(e.id))

    return [...taskEvents, ...additionalEvents]
  }, [tasks])

  const today = new Date()
  const dateString = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long'
  })

  const handleEventClick = (info: EventClickArg): void => {
    const taskId = info.event.extendedProps?.taskId || info.event.id
    if (taskId && onEventClick) {
      onEventClick(taskId)
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
          <Button icon={<FiPlus size={12} strokeWidth={2.5} />} onClick={onCreateTask}>New Task</Button>
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
            events={calendarEvents}
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
