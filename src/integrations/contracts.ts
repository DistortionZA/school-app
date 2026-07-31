import type { ProjectDraft, SyncStatus } from '../types'

export type SyncBatch = {
  schoolSourceId: string
  learners: Array<{ sourceId: string; firstName: string; lastName: string; grade: string; className: string; active: boolean }>
  subjects: Array<{ sourceId: string; name: string; grade: string }>
  syncedAt: string
}

export interface SchoolSyncClient {
  sync(batch: SyncBatch): Promise<SyncStatus>
  getStatus(): Promise<SyncStatus>
}

export interface MessageProvider {
  sendTemplate(input: { recipient: string; template: string; parameters: string[]; idempotencyKey: string }): Promise<{ providerMessageId: string }>
}

export interface ProjectsApi {
  listUpcoming(): Promise<unknown[]>
  publishProject(draft: ProjectDraft): Promise<unknown>
  markStarted(projectId: string): Promise<void>
}
