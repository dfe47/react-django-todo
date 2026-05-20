function TaskItem({ item, index, deleteTask }) {
  return (
    <li>
      {item}

      <button onClick={() => deleteTask(index)}>
        Delete
      </button>
    </li>
  )
}

export default TaskItem