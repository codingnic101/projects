class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  }

  addTask(title, description, dueDate, priority, category) {
    const task = {
      id: generateId(),
      title,
      description,
      dueDate,
      priority,
      category,
      completed: false,
      createdAt: new Date(),
    };
    this.tasks.push(task);
    this.saveTasks();
    return task;
  }

  getTaskById(id) {
    return this.tasks.find((task) => task.id === id);
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveTasks();
  }

  toggleTaskStatus(id) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
    }
  }

  editTask(id, updates) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      Object.assign(task, updates);
      this.saveTasks();
    }
  }

  filterTasks(status) {
    if (status === "all") return this.tasks;
    return this.tasks.filter(
      (task) => task.completed === (status === "completed")
    );
  }

  sortTasks(by) {
    if (by === "date") {
      return [...this.tasks].sort(
        (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
      );
    } else if (by === "priority") {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return [...this.tasks].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    }
    return this.tasks;
  }

  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  getSummary() {
    const total = this.tasks.length;
    const completed = this.tasks.filter((task) => task.completed).length;
    const active = total - completed;
    return { total, active, completed };
  }

  reorderTasks(oldIndex, newIndex) {
    const [movedTask] = this.tasks.splice(oldIndex, 1);
    this.tasks.splice(newIndex, 0, movedTask);
    this.saveTasks();
  }
}
