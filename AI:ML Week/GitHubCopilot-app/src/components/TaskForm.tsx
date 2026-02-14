import { useState } from 'react'
import type { FormEvent } from 'react'
import type {
  Task,
  TaskFormData,
  TaskCategory,
  Priority,
} from '../types'
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  PRIORITY_CONFIG,
} from '../types'

interface TaskFormProps {
  currentDate: string
  taskToEdit?: Task
  onSubmit: (data: TaskFormData) => void
  onDelete?: (id: number) => void
  onCancel: () => void
}

const INITIAL_FORM: TaskFormData = {
  title: '',
  description: '',
  category: 'work',
  date: '',
  time: '',
  priority: '',
}

export function TaskForm({ currentDate, taskToEdit, onSubmit, onDelete, onCancel }: TaskFormProps) {
  const isEditMode = !!taskToEdit

  const [formData, setFormData] = useState<TaskFormData>(() => {
    if (taskToEdit) {
      return {
        title: taskToEdit.title,
        description: taskToEdit.description,
        category: taskToEdit.category,
        date: taskToEdit.date,
        time: taskToEdit.time || '',
        priority: taskToEdit.priority || '',
      }
    }
    return { ...INITIAL_FORM, date: currentDate }
  })

  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (validate()) onSubmit(formData)
  }

  const handleChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleDelete = () => {
    if (taskToEdit && onDelete && confirm('Are you sure you want to delete this task?')) {
      onDelete(taskToEdit.id)
    }
  }

  const categories = Object.keys(CATEGORY_LABELS) as TaskCategory[]
  const priorities = Object.keys(PRIORITY_CONFIG) as Priority[]

  return (
    <div className="task-form-overlay" onClick={onCancel}>
      <form className="task-form-modal" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <div className="task-form-header">
          <h2 className="task-form-title">{isEditMode ? '✏️ Edit Task' : '✨ New Task'}</h2>
          <button type="button" className="task-form-close" onClick={onCancel} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="task-form-body">
          <div className="form-group">
            <label htmlFor="task-title" className="form-label form-label--required">Title</label>
            <input
              id="task-title"
              type="text"
              className={`form-input ${errors.title ? 'form-input--error' : ''}`}
              placeholder="e.g. Team meeting"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="task-description" className="form-label form-label--required">Description</label>
            <textarea
              id="task-description"
              className={`form-textarea ${errors.description ? 'form-input--error' : ''}`}
              placeholder="Describe the task..."
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label className="form-label form-label--required">Category</label>
            <div className="form-category-grid">
              {categories.map((cat) => {
                const colors = CATEGORY_COLORS[cat]
                const isSelected = formData.category === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`form-category-btn ${isSelected ? 'form-category-btn--selected' : ''}`}
                    style={{
                      backgroundColor: isSelected ? colors.badge : colors.bg,
                      borderColor: colors.border,
                      color: isSelected ? 'white' : colors.badge,
                    }}
                    onClick={() => handleChange('category', cat)}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group form-group--half">
              <label htmlFor="task-time" className="form-label">
                Time <span className="form-optional">(optional)</span>
              </label>
              <input
                id="task-time"
                type="time"
                className="form-input"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
              />
            </div>

            <div className="form-group form-group--half">
              <label className="form-label">
                Priority <span className="form-optional">(optional)</span>
              </label>
              <div className="form-priority-row">
                {priorities.map((prio) => {
                  const config = PRIORITY_CONFIG[prio]
                  const isSelected = formData.priority === prio
                  return (
                    <button
                      key={prio}
                      type="button"
                      className={`form-priority-btn ${isSelected ? 'form-priority-btn--selected' : ''}`}
                      style={{
                        borderColor: isSelected ? config.color : '#e5e7eb',
                        color: isSelected ? config.color : '#6b7280',
                        backgroundColor: isSelected ? `${config.color}15` : 'transparent',
                      }}
                      onClick={() => handleChange('priority', isSelected ? '' : prio)}
                    >
                      {config.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="task-form-footer">
          {isEditMode && onDelete && (
            <button type="button" className="form-btn form-btn--danger" onClick={handleDelete}>
              Delete
            </button>
          )}
          <div className="task-form-footer-right">
            <button type="button" className="form-btn form-btn--secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="form-btn form-btn--primary">
              {isEditMode ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
