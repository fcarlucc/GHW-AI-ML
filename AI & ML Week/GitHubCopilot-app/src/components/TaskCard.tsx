import type { Task } from '../types'
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  PRIORITY_CONFIG,
} from '../types'

interface TaskCardProps {
  task: Task
  onToggleCompleted: (id: number) => void
  onClick: (task: Task) => void
}

export function TaskCard({ task, onToggleCompleted, onClick }: TaskCardProps) {
  const colors = CATEGORY_COLORS[task.category]
  const categoryLabel = CATEGORY_LABELS[task.category]
  const priorityInfo = task.priority ? PRIORITY_CONFIG[task.priority] : null

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.task-card-checkbox')) {
      return
    }
    onClick(task)
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    onToggleCompleted(task.id)
  }

  return (
    <article
      className={`task-card ${task.completed ? 'task-card--completed' : ''}`}
      style={{
        backgroundColor: colors.bg,
        borderLeftColor: colors.border,
      }}
      onClick={handleCardClick}
    >
      <div className="task-card-header">
        <span className="task-card-badge" style={{ backgroundColor: colors.badge }}>
          {categoryLabel}
        </span>

        {task.time && <span className="task-card-time">🕐 {task.time}</span>}

        {priorityInfo && (
          <span className="task-card-priority" style={{ color: priorityInfo.color }}>
            ● {priorityInfo.label}
          </span>
        )}
      </div>

      <div className="task-card-body">
        <div className="task-card-checkbox-wrapper">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            className="task-card-checkbox"
          />
        </div>

        <div className="task-card-content">
          <h3 className="task-card-title">{task.title}</h3>
          <p className="task-card-description">{task.description}</p>
        </div>
      </div>
    </article>
  )
}
