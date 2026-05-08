import { useState, useEffect } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import CalendarView from './components/CalendarView'
import CompletedList from './components/CompletedList'
import MonthlyTasks from './components/MonthlyTasks'
import './App.css'

const STORAGE_KEY = 'company-tasks'

export default function App() {
  const [view, setView] = useState('tasks')
  const [tasks, setTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])
  const [monthlyTemplates, setMonthlyTemplates] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editTask, setEditTask] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      setTasks(data.tasks || [])
      setCompletedTasks(data.completedTasks || [])
      setMonthlyTemplates(data.monthlyTemplates || [])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, completedTasks, monthlyTemplates }))
  }, [tasks, completedTasks, monthlyTemplates])

  const addTask = (task) => {
    if (editTask) {
      setTasks(tasks.map(t => t.id === editTask.id ? { ...task, id: editTask.id } : t))
      setEditTask(null)
    } else {
      setTasks([...tasks, { ...task, id: Date.now(), createdAt: new Date().toISOString() }])
    }
    setShowForm(false)
  }

  const completeTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    setCompletedTasks([...completedTasks, { ...task, completedAt: new Date().toISOString() }])
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  const restoreTask = (taskId) => {
    const task = completedTasks.find(t => t.id === taskId)
    if (!task) return
    const { completedAt, ...rest } = task
    setTasks([...tasks, rest])
    setCompletedTasks(completedTasks.filter(t => t.id !== taskId))
  }

  const deleteCompleted = (taskId) => {
    setCompletedTasks(completedTasks.filter(t => t.id !== taskId))
  }

  const addMonthlyTemplate = (template) => {
    setMonthlyTemplates([...monthlyTemplates, { ...template, id: Date.now() }])
  }

  const deleteMonthlyTemplate = (id) => {
    setMonthlyTemplates(monthlyTemplates.filter(t => t.id !== id))
  }

  const spawnFromTemplate = (template) => {
    const newTask = {
      title: template.title,
      description: template.description,
      category: template.category,
      priority: template.priority,
      scheduledDate: '',
      dueDate: '',
      id: Date.now(),
      createdAt: new Date().toISOString(),
      isFromTemplate: true,
    }
    setTasks([...tasks, newTask])
    setView('tasks')
  }

  const handleEdit = (task) => {
    setEditTask(task)
    setShowForm(true)
  }

  const NAV_ITEMS = [
    { id: 'tasks', icon: '📝', label: 'タスク', badge: tasks.length },
    { id: 'calendar', icon: '📅', label: 'カレンダー', badge: null },
    { id: 'monthly', icon: '📌', label: '毎月業務', badge: null },
    { id: 'completed', icon: '✅', label: '完了済み', badge: completedTasks.length },
  ]

  return (
    <div className="app">
      <header className="app-header">
        <h1>📋 業務タスク管理</h1>
        <nav className="nav-tabs">
          <button className={view === 'tasks' ? 'active' : ''} onClick={() => setView('tasks')}>
            タスク一覧 <span className="badge">{tasks.length}</span>
          </button>
          <button className={view === 'calendar' ? 'active' : ''} onClick={() => setView('calendar')}>
            カレンダー
          </button>
          <button className={view === 'monthly' ? 'active' : ''} onClick={() => setView('monthly')}>
            毎月業務
          </button>
          <button className={view === 'completed' ? 'active' : ''} onClick={() => setView('completed')}>
            完了済み <span className="badge badge-done">{completedTasks.length}</span>
          </button>
        </nav>
      </header>

      <main className="app-main">
        {view === 'tasks' && (
          <>
            <div className="action-bar">
              <button className="btn-primary" onClick={() => { setEditTask(null); setShowForm(true) }}>
                ＋ タスクを追加
              </button>
            </div>
            {showForm && (
              <TaskForm
                onSave={addTask}
                onCancel={() => { setShowForm(false); setEditTask(null) }}
                initialData={editTask}
              />
            )}
            <TaskList
              tasks={tasks}
              onComplete={completeTask}
              onDelete={deleteTask}
              onEdit={handleEdit}
            />
          </>
        )}
        {view === 'calendar' && (
          <CalendarView tasks={tasks} onComplete={completeTask} />
        )}
        {view === 'monthly' && (
          <MonthlyTasks
            templates={monthlyTemplates}
            onAdd={addMonthlyTemplate}
            onDelete={deleteMonthlyTemplate}
            onSpawn={spawnFromTemplate}
          />
        )}
        {view === 'completed' && (
          <CompletedList
            tasks={completedTasks}
            onRestore={restoreTask}
            onDelete={deleteCompleted}
          />
        )}
      </main>

      {/* スマホ用ボトムナビ */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`bottom-nav-btn ${view === item.id ? 'active' : ''}`}
            onClick={() => setView(item.id)}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
            {item.badge > 0 && <span className="bottom-nav-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      {/* スマホ用 FAB（タスク追加ボタン） */}
      {view === 'tasks' && (
        <button
          className="fab"
          onClick={() => { setEditTask(null); setShowForm(true) }}
          aria-label="タスクを追加"
        >
          ＋
        </button>
      )}
    </div>
  )
}
