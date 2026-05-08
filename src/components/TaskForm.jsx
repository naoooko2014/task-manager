import { useState, useEffect } from 'react'

const CATEGORIES = ['営業', '経理', '総務', '人事', '企画', 'その他']
const PRIORITIES = [
  { value: 'high', label: '高', color: '#e74c3c' },
  { value: 'medium', label: '中', color: '#f39c12' },
  { value: 'low', label: '低', color: '#27ae60' },
]

export default function TaskForm({ onSave, onCancel, initialData }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'その他',
    priority: 'medium',
    scheduledDate: '',
    dueDate: '',
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'その他',
        priority: initialData.priority || 'medium',
        scheduledDate: initialData.scheduledDate || '',
        dueDate: initialData.dueDate || '',
      })
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave(form)
  }

  return (
    <div className="form-overlay">
      <form className="task-form" onSubmit={handleSubmit}>
        <h2>{initialData ? 'タスクを編集' : '新しいタスク'}</h2>

        <div className="form-group">
          <label>タスク名 *</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="タスク名を入力"
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>詳細・メモ</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="詳細やメモを入力（任意）"
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>カテゴリ</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>優先度</label>
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
              {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>📅 実施予定日</label>
            <input
              type="date"
              value={form.scheduledDate}
              onChange={e => setForm({ ...form, scheduledDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>⏰ 期限</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>キャンセル</button>
          <button type="submit" className="btn-primary">{initialData ? '更新' : '追加'}</button>
        </div>
      </form>
    </div>
  )
}
