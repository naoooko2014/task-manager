import { useState } from 'react'

const PRIORITY_COLORS = { high: '#e74c3c', medium: '#f39c12', low: '#27ae60' }
const PRIORITY_LABELS = { high: '高', medium: '中', low: '低' }

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function isOverdue(dateStr) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date(new Date().toDateString())
}

export default function TaskList({ tasks, onComplete, onDelete, onEdit }) {
  const [expandedId, setExpandedId] = useState(null)

  const sorted = [...tasks].sort((a, b) => {
    const pa = { high: 0, medium: 1, low: 2 }
    if (pa[a.priority] !== pa[b.priority]) return pa[a.priority] - pa[b.priority]
    if (a.scheduledDate && b.scheduledDate) return new Date(a.scheduledDate) - new Date(b.scheduledDate)
    if (a.scheduledDate) return -1
    if (b.scheduledDate) return 1
    return 0
  })

  if (sorted.length === 0) {
    return (
      <div className="empty-state">
        <p>📝 タスクがありません</p>
        <p>＋ボタンからタスクを作成してください</p>
      </div>
    )
  }

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id)

  return (
    <div className="task-list">
      {sorted.map(task => {
        const overdue = isOverdue(task.dueDate)
        const expanded = expandedId === task.id
        const scheduledDate = formatDate(task.scheduledDate)
        const dueDate = formatDate(task.dueDate)

        return (
          <div
            key={task.id}
            className={`task-row ${overdue ? 'overdue' : ''} ${expanded ? 'expanded' : ''}`}
            onClick={() => toggle(task.id)}
          >
            <div className="task-row-main">
              <button
                className="complete-btn"
                onClick={e => { e.stopPropagation(); onComplete(task.id) }}
                title="完了"
              >✓</button>

              <div className="task-row-info">
                <span
                  className="priority-dot"
                  style={{ background: PRIORITY_COLORS[task.priority] }}
                  title={PRIORITY_LABELS[task.priority]}
                />
                <span className="task-row-title">{task.title}</span>
                {task.isFromTemplate && <span className="template-badge">毎月</span>}
              </div>

              <div className="task-row-dates">
                {scheduledDate && (
                  <span className="row-date scheduled-date">📅{scheduledDate}</span>
                )}
                {overdue && (
                  <span className="row-date overdue-date">⚠️期限切れ</span>
                )}
              </div>

              <span className="expand-icon">{expanded ? '▲' : '▼'}</span>
            </div>

            {expanded && (
              <div className="task-row-detail" onClick={e => e.stopPropagation()}>
                <div className="task-row-meta">
                  <span className="category-badge">{task.category}</span>
                  <span className="priority-badge" style={{ background: PRIORITY_COLORS[task.priority] }}>
                    優先度:{PRIORITY_LABELS[task.priority]}
                  </span>
                  {dueDate && (
                    <span className={`date-tag ${overdue ? '' : 'due'}`} style={overdue ? {background:'#fce8e6',color:'#c5221f'} : {}}>
                      ⏰ 期限:{dueDate}
                    </span>
                  )}
                </div>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <div className="task-row-actions">
                  <button className="btn-edit" onClick={() => { onEdit(task); setExpandedId(null) }}>✏️ 編集</button>
                  <button className="btn-delete" onClick={() => onDelete(task.id)}>🗑 削除</button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
