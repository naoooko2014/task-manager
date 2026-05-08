const PRIORITY_LABELS = { high: '高', medium: '中', low: '低' }
const PRIORITY_COLORS = { high: '#e74c3c', medium: '#f39c12', low: '#27ae60' }

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
  const sorted = [...tasks].sort((a, b) => {
    const pa = { high: 0, medium: 1, low: 2 }
    if (pa[a.priority] !== pa[b.priority]) return pa[a.priority] - pa[b.priority]
    if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate)
    if (a.dueDate) return -1
    if (b.dueDate) return 1
    return 0
  })

  if (sorted.length === 0) {
    return (
      <div className="empty-state">
        <p>📝 タスクがありません</p>
        <p>「タスクを追加」ボタンからタスクを作成してください</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      {sorted.map(task => (
        <div
          key={task.id}
          className={`task-card ${isOverdue(task.dueDate) ? 'overdue' : ''}`}
        >
          <div className="task-card-left">
            <button className="complete-btn" onClick={() => onComplete(task.id)} title="完了にする">
              ✓
            </button>
          </div>
          <div className="task-card-body">
            <div className="task-card-top">
              <span className="task-title">{task.title}</span>
              <span
                className="priority-badge"
                style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
              >
                {PRIORITY_LABELS[task.priority]}
              </span>
              <span className="category-badge">{task.category}</span>
              {task.isFromTemplate && <span className="template-badge">毎月</span>}
            </div>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            <div className="task-dates">
              {task.scheduledDate && (
                <span className="date-tag scheduled">
                  📅 実施予定: {formatDate(task.scheduledDate)}
                </span>
              )}
              {task.dueDate && (
                <span className={`date-tag due ${isOverdue(task.dueDate) ? 'overdue-text' : ''}`}>
                  ⏰ 期限: {formatDate(task.dueDate)}
                  {isOverdue(task.dueDate) && ' ⚠️ 期限超過'}
                </span>
              )}
            </div>
          </div>
          <div className="task-card-actions">
            <button className="btn-edit" onClick={() => onEdit(task)}>編集</button>
            <button className="btn-delete" onClick={() => onDelete(task.id)}>削除</button>
          </div>
        </div>
      ))}
    </div>
  )
}
