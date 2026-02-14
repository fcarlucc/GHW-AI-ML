import { DAYS_EN, MONTHS_EN } from '../types'

interface AgendaHeaderProps {
  currentDate: Date
  onDateChange: (date: Date) => void
  onAddTask: () => void
}

// Full-width header for the agenda app
// Shows day name, date number, year and provides date picker + add button
export function AgendaHeader({
  currentDate,
  onDateChange,
  onAddTask,
}: AgendaHeaderProps) {
  const dayName = DAYS_EN[currentDate.getDay()]
  const dayNumber = currentDate.getDate()
  const monthName = MONTHS_EN[currentDate.getMonth()]
  const year = currentDate.getFullYear()

  // Format date for input (YYYY-MM-DD)
  const dateInputValue = currentDate.toISOString().split('T')[0]

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value + 'T12:00:00')
    if (!isNaN(newDate.getTime())) {
      onDateChange(newDate)
    }
  }

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-date">
          <h1 className="header-day-name">{dayName}</h1>
          <div className="header-date-row">
            <span className="header-day-number">{dayNumber}</span>
            <div className="header-month-year">
              <span className="header-month">{monthName}</span>
              <span className="header-year">{year}</span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <input
            type="date"
            className="header-date-picker"
            value={dateInputValue}
            onChange={handleDateInputChange}
            aria-label="Select date"
          />
          <button
            type="button"
            className="header-add-btn"
            onClick={onAddTask}
            aria-label="Add new task"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </header>
  )
}
