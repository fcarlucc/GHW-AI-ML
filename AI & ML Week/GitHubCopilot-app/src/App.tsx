import { useEffect, useState } from 'react'
import './App.css'
import type { Task, TaskFormData } from './types'
import { AgendaHeader } from './components/AgendaHeader'
import { TaskCard } from './components/TaskCard'
import { TaskForm } from './components/TaskForm'
import { AppFooter } from './components/AppFooter'

const STORAGE_KEY = 'agenda-tasks'

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

function App() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (!stored) return []
      return JSON.parse(stored) as Task[]
    } catch (error) {
      console.error('Failed to load tasks from localStorage', error)
      return []
    }
  })

  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const handleDateChange = (date: Date) => {
    setCurrentDate(date)
  }

  const handleCreateTask = (formData: TaskFormData) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category,
                date: formData.date,
                time: formData.time || undefined,
                priority: formData.priority || undefined,
              }
            : task
        )
      )
      setEditingTask(undefined)
    } else {
      const newTask: Task = {
        id: Date.now(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        date: formData.date,
        time: formData.time || undefined,
        priority: formData.priority || undefined,
        completed: false,
        createdAt: Date.now(),
      }
      setTasks((prev) => [...prev, newTask])
    }
    setShowForm(false)
  }

  const toggleTaskCompleted = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
    setShowForm(false)
    setEditingTask(undefined)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingTask(undefined)
  }

  const currentDateStr = formatDate(currentDate)

  const tasksForDay = tasks
    .filter((task) => task.date === currentDateStr)
    .sort((a, b) => {
      if (a.time && b.time) return a.time.localeCompare(b.time)
      if (a.time) return -1
      if (b.time) return 1
      return a.createdAt - b.createdAt
    })

  return (
    <div className="agenda-app">
      <AgendaHeader
        currentDate={currentDate}
        onDateChange={handleDateChange}
        onAddTask={() => setShowForm(true)}
      />

      <main className="agenda-body">
        <div className="agenda-grid">
          {tasksForDay.length === 0 ? (
            <div className="agenda-empty">
              <div className="agenda-empty-icon">📅</div>
              <p className="agenda-empty-text">No tasks for this day.</p>
              <p className="agenda-empty-hint">Click "Add Task" to create one!</p>
            </div>
          ) : (
            tasksForDay.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleCompleted={toggleTaskCompleted}
                onClick={handleEditTask}
              />
            ))
          )}
        </div>
      </main>

      <AppFooter />

      {showForm && (
        <TaskForm
          currentDate={currentDateStr}
          taskToEdit={editingTask}
          onSubmit={handleCreateTask}
          onDelete={editingTask ? deleteTask : undefined}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  )
}

export default App
