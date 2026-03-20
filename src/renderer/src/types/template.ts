// Template 관련 타입 정의

export interface TemplateTask {
  id: string
  title: string
  tag?: string
}

export interface Template {
  id: string
  name: string
  description?: string
  tasks: TemplateTask[]
  createdAt: string
}
