const PRIORITY_COLORS = { high: '#e74c3c', medium: '#f39c12', low: '#27ae60' }
const PRIORITY_LABELS = { high: '高', medium: '中', low: '低' }

function formatDateTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function CompletedList({ tasks, onRestore, onDelete }) {
  const sorted = [...tasks].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))

  if (sorted.length === 0) {
    return (
      <div className="empty-state">
        <p>✅ 完了済みタスクはありません</p>
        <p>タスクを完了にすると、ここに表示されます</p>
      </div>
    )
  }

  return (
    <div className="completed-list">
      <div className="completed-header">
        <h2>完了済みタスク</h2>
        <p>{sorted.length} 件</p>
      </div>
      {sorted.map(task => (
        <div key={task.id} className="task-card completed-card">
          <div className="task-card-left">
            <span className="done-icon">✓</span>
          </div>
          <div className="task-card-body">
            <div className="task-card-top">
              <span className="task-title completed-title">{task.title}</span>
              <span
                className="priority-badge"
                style={{ backgroundColor: PRIORITY_COLORS[task.priority], opacity: 0.7 }}
              >
                {PRIORITY_LABELS[task.priority]}
              </span>
              <span className="category-badge">{task.category}</span>
            </div>
            {task.description && <p className="task-description">{task.description}</p>}
            <div className="task-dates">
              <span className="date-tag completed-date">
                ✅ 完了: {formatDateTime(task.completedAt)}
              </span>
              {task.dueDate && (
                <span className="date-tag">期限: {task.dueDate}</span>
              )}
            </div>
          </div>
          <div className="task-card-actions">
            <button className="btn-restore" onClick={() => onRestore(task.id)}>戻す</button>
            <button className="btn-delete" onClick={() => onDelete(task.id)}>削除</button>
          </div>
        </div>
      ))}
    </div>
  )
}
