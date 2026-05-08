import { useState } from 'react'

const DAYS = ['日', '月', '火', '水', '木', '金', '土']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export default function CalendarView({ tasks, onComplete }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(null)

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelectedDay(null)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelectedDay(null)
  }

  const pad = (n) => String(n).padStart(2, '0')
  const dateStr = (day) => `${year}-${pad(month + 1)}-${pad(day)}`

  const getTasksForDay = (day) => {
    const ds = dateStr(day)
    return tasks.filter(t => t.scheduledDate === ds || t.dueDate === ds)
  }

  const selectedTasks = selectedDay ? getTasksForDay(selectedDay) : []

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}>‹</button>
        <h2>{year}年 {month + 1}月</h2>
        <button onClick={nextMonth}>›</button>
      </div>

      <div className="calendar-grid">
        {DAYS.map((d, i) => (
          <div key={d} className={`cal-day-header ${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}`}>{d}</div>
        ))}
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="cal-cell empty" />
          const dayTasks = getTasksForDay(day)
          const isToday = dateStr(day) === todayStr
          const isSelected = selectedDay === day
          const hasDue = dayTasks.some(t => t.dueDate === dateStr(day))
          const hasScheduled = dayTasks.some(t => t.scheduledDate === dateStr(day))
          const dow = (firstDay + day - 1) % 7
          return (
            <div
              key={day}
              className={`cal-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayTasks.length > 0 ? 'has-task' : ''} ${dow === 0 ? 'sun' : dow === 6 ? 'sat' : ''}`}
              onClick={() => setSelectedDay(isSelected ? null : day)}
            >
              <span className="cal-day-num">{day}</span>
              <div className="cal-dots">
                {hasScheduled && <span className="dot scheduled-dot" title="実施予定" />}
                {hasDue && <span className="dot due-dot" title="期限" />}
              </div>
              {dayTasks.length > 0 && (
                <span className="cal-task-count">{dayTasks.length}</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="cal-legend">
        <span><span className="dot scheduled-dot" /> 実施予定</span>
        <span><span className="dot due-dot" /> 期限</span>
      </div>

      {selectedDay && (
        <div className="cal-task-panel">
          <h3>{month + 1}月{selectedDay}日のタスク</h3>
          {selectedTasks.length === 0 ? (
            <p className="no-tasks">タスクなし</p>
          ) : (
            selectedTasks.map(task => (
              <div key={task.id} className="cal-task-item">
                <div className="cal-task-info">
                  <strong>{task.title}</strong>
                  <div className="cal-task-meta">
                    {task.scheduledDate === dateStr(selectedDay) && <span className="date-tag scheduled">📅 実施予定</span>}
                    {task.dueDate === dateStr(selectedDay) && <span className="date-tag due">⏰ 期限</span>}
                    <span className="category-badge">{task.category}</span>
                  </div>
                </div>
                <button className="complete-btn small" onClick={() => onComplete(task.id)}>✓ 完了</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
