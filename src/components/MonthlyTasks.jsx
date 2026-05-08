import { useState } from 'react'

const CATEGORIES = ['営業', '経理', '総務', '人事', '企画', 'その他']
const PRIORITIES = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
]

export default function MonthlyTasks({ templates, onAdd, onDelete, onSpawn }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', category: 'その他', priority: 'medium' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onAdd(form)
    setForm({ title: '', description: '', category: 'その他', priority: 'medium' })
    setShowForm(false)
  }

  return (
    <div className="monthly-container">
      <div className="monthly-header">
        <div>
          <h2>毎月業務テンプレート</h2>
          <p className="monthly-desc">毎月繰り返す業務を登録しておくと、ワンクリックでタスクに追加できます</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>＋ テンプレート追加</button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <form className="task-form" onSubmit={handleSubmit}>
            <h2>毎月業務テンプレート</h2>
            <div className="form-group">
              <label>業務名 *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="例: 月次報告書作成"
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>詳細・メモ</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="手順やメモ（任意）"
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
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>キャンセル</button>
              <button type="submit" className="btn-primary">登録</button>
            </div>
          </form>
        </div>
      )}

      {templates.length === 0 ? (
        <div className="empty-state">
          <p>🔄 毎月業務テンプレートがありません</p>
          <p>毎月繰り返す業務を登録して、効率よくタスク管理しましょう</p>
        </div>
      ) : (
        <div className="template-grid">
          {templates.map(t => (
            <div key={t.id} className="template-card">
              <div className="template-card-body">
                <h3>{t.title}</h3>
                {t.description && <p>{t.description}</p>}
                <div className="template-meta">
                  <span className="category-badge">{t.category}</span>
                  <span className={`priority-text priority-${t.priority}`}>
                    優先度: {PRIORITIES.find(p => p.value === t.priority)?.label}
                  </span>
                </div>
              </div>
              <div className="template-actions">
                <button className="btn-spawn" onClick={() => onSpawn(t)}>
                  ▶ 今月のタスクに追加
                </button>
                <button className="btn-delete small" onClick={() => onDelete(t.id)}>削除</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
