export type Audience = 'teacher' | 'parent'
export type ProjectStatus = 'published' | 'draft' | 'cancelled'

export type Project = {
  id: string
  title: string
  subject: string
  grade: string
  className: string
  dueDate: string
  description: string
  materials: string[]
  status: ProjectStatus
  createdAt: string
  startedBy: string[]
}

export type ProjectDraft = Omit<Project, 'id' | 'status' | 'createdAt' | 'startedBy'>

export type SyncStatus = {
  lastSyncedAt: string
  records: number
  state: 'connected' | 'attention' | 'offline'
}
