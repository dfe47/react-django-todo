import { useEffect, useState } from "react"
import "./App.css"

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function App() {
  const [task, setTask]     = useState("")
  const [tasks, setTasks]   = useState([])
  const [filter, setFilter] = useState("all")

useEffect(() => {
  fetch("http://127.0.0.1:8000/api/tasks/")
    .then(res => res.json())
    .then(data => setTasks(data))
    .catch(err => console.error(err))
}, [])


  function addTask() {
  if (task.trim() === "") return

  fetch("http://127.0.0.1:8000/api/tasks/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: task.trim(),
      completed: false,
    }),
  })
    .then(res => res.json())
    .then(newTask => {
      setTasks([newTask, ...tasks])
      setTask("")
    })
    .catch(err => console.error(err))
}

  function deleteTask(id) {
  fetch(`http://127.0.0.1:8000/api/tasks/${id}/delete/`, {
    method: "DELETE",
  })
    .then(() => {
      setTasks(tasks.filter(t => t.id !== id))
    })
    .catch(err => console.error(err))
}

 function toggleTask(id) {
  fetch(`http://127.0.0.1:8000/api/tasks/${id}/toggle/`, {
    method: "PATCH",
  })
    .then(res => res.json())
    .then(updatedTask => {
      setTasks(tasks.map(t => t.id === id ? updatedTask : t))
    })
    .catch(err => console.error(err))
}

  function clearCompleted() {
    setTasks(tasks.filter(t => !t.completed))
  }

  const total  = tasks.length
  const done   = tasks.filter(t => t.completed).length
  const active = total - done

  const visible = tasks.filter(t => {
    if (filter === "active") return !t.completed
    if (filter === "done")   return  t.completed
    return true
  })

  return (
    <div className="page">

      {/* Header */}
      <div className="header-tag">Task Manager</div>
      <h1 className="app-title">What needs<br />to be done?</h1>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-cell">
          <span className="stat-num">{total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-cell">
          <span className="stat-num yellow">{active}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-cell">
          <span className="stat-num purple">{done}</span>
          <span className="stat-label">Done</span>
        </div>
      </div>

      {/* Input */}
      <div className="input-row">
        <input
          className="task-input"
          type="text"
          placeholder="Add a new task…"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button className="add-btn" onClick={addTask}>
          <PlusIcon /> Add
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        {["all", "active", "done"].map(f => (
          <button
            key={f}
            className={`f-btn ${filter === f ? "on" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Task list */}
      <ul className="task-list">
        {visible.length === 0 && (
          <li className="empty">
            <span className="empty-icon">✦</span>
            {filter === "done"   ? "Nothing completed yet." :
             filter === "active" ? "All caught up!" :
                                   "Add your first task above."}
          </li>
        )}

        {visible.map(item => (
          <li key={item.id} className={`task-item ${item.completed ? "done" : ""}`}>
            <button className="check-btn" onClick={() => toggleTask(item.id)}>
              {item.completed && <CheckIcon />}
            </button>
            <span className="task-text">{item.title}</span>
            <button className="del-btn" onClick={(e) => { e.stopPropagation(); deleteTask(item.id) }}>
              <XIcon />
            </button>
          </li>
        ))}
      </ul>

      {done > 0 && (
        <button className="clear-btn" onClick={clearCompleted}>
          Clear {done} completed
        </button>
      )}
    </div>
  )
}

export default App
