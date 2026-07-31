import type { Project, SyncStatus } from './types'

export const currentUser = {
  name: 'Ms. Mokoena',
  role: 'Grade 5 teacher',
  initials: 'MM',
}

export const syncStatus: SyncStatus = {
  lastSyncedAt: 'Today at 02:14',
  records: 286,
  state: 'connected',
}

export const demoProjects: Project[] = [
  {
    id: 'solar-system',
    title: 'Solar System Model',
    subject: 'Natural Sciences',
    grade: 'Grade 5',
    className: '5A',
    dueDate: '2026-08-15',
    description: 'Build a labelled model showing the sun and eight planets. Your model should explain one interesting fact about each planet.',
    materials: ['Recycled cardboard', 'Paint or coloured paper', 'String', 'Labels'],
    status: 'published',
    createdAt: '2026-07-20',
    startedBy: ['amina'],
  },
  {
    id: 'heritage-interview',
    title: 'My Heritage Interview',
    subject: 'Life Skills',
    grade: 'Grade 5',
    className: '5A',
    dueDate: '2026-08-22',
    description: 'Interview an older family member about a tradition your family values. Bring a one-page write-up to class.',
    materials: ['Notebook', 'Three interview questions', 'A family photo (optional)'],
    status: 'published',
    createdAt: '2026-07-28',
    startedBy: [],
  },
  {
    id: 'fractions-kitchen',
    title: 'Fractions in the Kitchen',
    subject: 'Mathematics',
    grade: 'Grade 5',
    className: '5A',
    dueDate: '2026-09-02',
    description: 'Find a recipe that uses fractions. Copy it neatly and circle three fractions you found.',
    materials: ['Recipe book or printed recipe', 'A4 paper', 'Pencil crayons'],
    status: 'published',
    createdAt: '2026-07-30',
    startedBy: [],
  },
]

