import { useState } from 'react'

const PRIORITY_COLORS = { high: '#e74c3c', medium: '#f39c12', low: '#27ae60' }
const PRIORITY_LABELS = { high: '高', medium: '中', low: '低' }

function formatDate(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function formatDateTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function CompletedList({ tasks, onRestore, onDelete }) {
  const [expandedId, setExpandedId] = useState(null)
  const sorted = [...tasks].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))

  if (sorted.length === 0) {
    return (
      <div className="empty-state">
        <p>✅ 完了済みタスクはありません</p>
        <p>タスクを完了にすると、ここに表示されます</p>
      </div>
    )
  }

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id)

  return (
    <div className="completed-list">
      <div className="completed-header">
        <h2>完了済みタスク</h2>
        <p>{sorted.length} 件</p>
      </div>
      <div className="task-list">
        {sorted.map(task => {
          const expanded = expandedId === task.id
          return (
            <div
              key={task.id}
              className={`task-row completed-row ${expanded ? 'expanded' : ''}`}
              onClick={() => toggle(task.id)}
            >
              <div className="task-row-main">
                <span className="done-icon">✓</span>

                <div className="task-row-info">
                  <span className="task-row-title completed-title">{task.title}</span>
                </div>

                <div className="task-row-dates">
                  <span className="row-date completed-date-tag">✅{formatDate(task.completedAt)}</span>
                </div>

                <span className="expand-icon">{expanded ? '▲' : '▼'}</span>
              </div>

              {expanded && (
                <div className="task-row-detail" onClick={e => e.stopPropagation()}>
                  <div className="task-row-meta">
                    <span className="category-badge">{task.category}</span>
                    <span className="priority-badge" style={{ background: PRIORITY_COLORS[task.priority], opacity: 0.8 }}>
                      {PRIORITY_LABELS[task.priority]}
                    </span>
                    <span className="date-tag completed-date">完了: {formatDateTime(task.completedAt)}</span>
                  </div>
                  {task.description && <p className="task-description">{task.description}</p>}
                  <div className="task-row-actions">
                    <button className="btn-restore" onClick={() => onRestore(task.id)}>↩ 戻す</button>
                    <button className="btn-delete" onClick={() => onDelete(task.id)}>🗑 削除</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
