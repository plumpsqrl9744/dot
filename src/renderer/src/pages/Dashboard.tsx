import { JSX, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { TaskItem } from '../components/dashboard/TaskItem'

export function Dashboard(): JSX.Element {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: '마케팅 미팅 회의록 정리',
      completed: false,
      priority: 'high' as const,
      time: '6:00'
    },
    { id: '2', title: '클라이언트 메일 발송 (완료됨)', completed: true, time: '2:00' },
    { id: '3', title: '서버 아키텍처 다이어그램 작성', completed: false, from: '이영희' },
    {
      id: '4',
      title: '경쟁사 분석 보고서',
      completed: false,
      priority: 'medium' as const,
      dueDate: 'D-3 (3/28)'
    },
    { id: '5', title: '주간 업무 보고', completed: false, dueDate: 'D-5 (3/30)' },
    { id: '6', title: '포트폴리오 정리', completed: false }
  ])

  const toggleTask = (id: string): void => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  return (
    <div className="h-full overflow-auto bg-[#F7F7F7] custom-scrollbar">
      <div className="max-w-[1600px] mx-auto px-20 py-24 space-y-28">
        {/* Section: Critical Dots */}
        <section className="space-y-12">
          <div className="flex items-center gap-3 border-b border-border/20 pb-6">
            <h2 className="text-[14px] font-black tracking-[0.25em] uppercase px-1 text-text-secondary">
              Critical Dots
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <TaskItem
              id="critical-1"
              title="제안서 최종 수정"
              completed={false}
              priority="high"
              time="2:00"
              onToggle={() => {}}
            />
            <TaskItem
              id="critical-2"
              title="UI 디자인 검토"
              completed={false}
              priority="high"
              from="김철수"
              dueDate="1일 경과"
              onToggle={() => {}}
            />
            <TaskItem
              id="critical-3"
              title="서버 부하 테스트"
              completed={false}
              priority="high"
              time="8:00"
              onToggle={() => {}}
            />
          </div>
        </section>

        {/* Section: Today / Inbox (strictly 2 columns) */}
        <div className="space-y-24">
          <section className="space-y-12">
            <div className="flex items-center justify-between border-b border-border/20 pb-6">
              <h3 className="text-[14px] font-black tracking-[0.25em] uppercase text-text-secondary">
                Today / Inbox
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {tasks
                .filter((t) => t.time || t.from)
                .map((task) => (
                  <TaskItem key={task.id} {...task} onToggle={toggleTask} />
                ))}

              {/* Add New Hook */}
              <button className="flex flex-col items-center justify-center p-12 rounded-[30px] border-2 border-dashed border-border/40 text-text-placeholder hover:border-primary/30 hover:text-primary transition-all group scale-100 active:scale-[0.98] bg-white/50 hover:bg-white shadow-sm hover:shadow-md h-full min-h-[240px]">
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:shadow-md transition-all">
                  <FiPlus size={28} />
                </div>
                <span className="text-[15px] font-black tracking-tight">New Dot</span>
              </button>
            </div>
          </section>

          {/* Section: Backlog / Upcoming (strictly 2 columns) */}
          <section className="space-y-12 pb-48">
            <div className="flex items-center justify-between border-b border-border/20 pb-6">
              <h3 className="text-[14px] font-black tracking-[0.25em] uppercase text-text-placeholder">
                Backlog / Upcoming
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {tasks
                .filter((t) => !t.time && !t.from)
                .map((task) => (
                  <TaskItem key={task.id} {...task} onToggle={toggleTask} />
                ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
