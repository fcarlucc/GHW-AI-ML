// ============================================================
// Types for the Agenda application
// ============================================================

// Available task categories with associated colors
export type TaskCategory =
  | 'work'
  | 'personal'
  | 'health'
  | 'meeting'
  | 'deadline'
  | 'reminder'

// Priority levels
export type Priority = 'low' | 'medium' | 'high'

// Color palette for task categories
export const CATEGORY_COLORS: Record<TaskCategory, { bg: string; border: string; badge: string }> = {
  work: { bg: '#eff6ff', border: '#3b82f6', badge: '#2563eb' },
  personal: { bg: '#fdf4ff', border: '#c026d3', badge: '#a21caf' },
  health: { bg: '#ecfdf5', border: '#10b981', badge: '#059669' },
  meeting: { bg: '#fef3c7', border: '#f59e0b', badge: '#d97706' },
  deadline: { bg: '#fef2f2', border: '#ef4444', badge: '#dc2626' },
  reminder: { bg: '#f0fdf4', border: '#22c55e', badge: '#16a34a' },
}

// Category labels for display (English)
export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  work: 'Work',
  personal: 'Personal',
  health: 'Health',
  meeting: 'Meeting',
  deadline: 'Deadline',
  reminder: 'Reminder',
}

// Priority labels and colors (English)
export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  low: { label: 'Low', color: '#6b7280' },
  medium: { label: 'Medium', color: '#f59e0b' },
  high: { label: 'High', color: '#ef4444' },
}

// A single task/event in the agenda
export interface Task {
  id: number
  title: string
  description: string
  category: TaskCategory
  date: string // ISO date string (YYYY-MM-DD)
  time?: string // Optional time (HH:mm)
  priority?: Priority
  completed: boolean
  createdAt: number
}

// Form data for creating/editing a task
export interface TaskFormData {
  title: string
  description: string
  category: TaskCategory
  date: string
  time: string
  priority: Priority | ''
}

// Days of the week (English)
export const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Months (English)
export const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
