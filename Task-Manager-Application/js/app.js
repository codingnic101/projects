const taskManager = new TaskManager();

// DOM elements
const addTaskForm = document.getElementById("add-task-form");
const taskList = document.getElementById("tasks");
const filterButtons = document.querySelectorAll("#task-filters button");
const sortSelect = document.getElementById("sort-by");
const editTaskSection = document.getElementById('edit-task-section');
const editTaskForm = document.getElementById('edit-task-form');
const cancelEditButton = document.getElementById('cancel-edit');

// Add task form submission
addTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  const dueDate = document.getElementById("task-due-date").value;
  const priority = document.getElementById("task-priority").value;
  const category = document.getElementById("task-category").value;

  const task = taskManager.addTask(
    title,
    description,
    dueDate,
    priority,
    category
  );
  renderTasks();
  addTaskForm.reset();
  updateSummary();
});

// Render a single task
function renderTask(task) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.draggable = true;
  li.dataset.id = task.id;
  li.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p>Due: ${formatDate(task.dueDate)}</p>
      <p>Priority: ${task.priority}</p>
      <p>Category: ${task.category}</p>
      <button class="toggle-status">${task.completed ? 'Mark Incomplete' : 'Mark Complete'}</button>
      <button class="edit-task">Edit</button>
      <button class="delete-task">Delete</button>
  `;
  if (task.completed) li.classList.add('completed');
  return li;
}

// Render all tasks
function renderTasks() {
  taskList.innerHTML = '';
  taskManager.tasks.forEach(task => {
      taskList.appendChild(renderTask(task));
  });
  addDragAndDropListeners();
}

// Event delegation for task actions
taskList.addEventListener("click", (e) => {
  const taskId = e.target.closest("li").dataset.id;

  if (e.target.classList.contains("toggle-status")) {
    taskManager.toggleTaskStatus(taskId);
    renderTasks();
    updateSummary();
  } else if (e.target.classList.contains("delete-task")) {
    taskManager.deleteTask(taskId);
    renderTasks();
    updateSummary();
  } else if (e.target.classList.contains("edit-task")) {
    const task = taskManager.getTaskById(taskId);
    if (task) {
        showEditForm(task);
    }
  }
});

// Add drag and drop event listeners
function addDragAndDropListeners() {
  const taskItems = document.querySelectorAll('.task-item');
  taskItems.forEach(item => {
      item.addEventListener('dragstart', dragStart);
      item.addEventListener('dragover', dragOver);
      item.addEventListener('drop', drop);
      item.addEventListener('dragenter', dragEnter);
      item.addEventListener('dragleave', dragLeave);
  });
}

// Filter tasks
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const status = button.id.split("-")[1]; // 'all', 'active', or 'completed'
    const filteredTasks = taskManager.filterTasks(status);
    renderFilteredTasks(filteredTasks);
  });
});

// Sort tasks
sortSelect.addEventListener("change", () => {
  const sortedTasks = taskManager.sortTasks(sortSelect.value);
  renderFilteredTasks(sortedTasks);
});

// Render filtered or sorted tasks
function renderFilteredTasks(tasks) {
  taskList.innerHTML = "";
  tasks.forEach(renderTask);
}

// Update summary
function updateSummary() {
  const summary = taskManager.getSummary();
  document.getElementById("total-tasks").textContent = summary.total;
  document.getElementById("active-tasks").textContent = summary.active;
  document.getElementById("completed-tasks").textContent = summary.completed;
}

// Editing
// Show edit form
function showEditForm(task) {
  document.getElementById('edit-task-id').value = task.id;
  document.getElementById('edit-task-title').value = task.title;
  document.getElementById('edit-task-description').value = task.description;
  document.getElementById('edit-task-due-date').value = task.dueDate;
  document.getElementById('edit-task-priority').value = task.priority;
  document.getElementById('edit-task-category').value = task.category;

  editTaskSection.style.display = 'block';
  addTaskForm.style.display = 'none';
}

// Hide edit form
function hideEditForm() {
  editTaskSection.style.display = 'none';
  addTaskForm.style.display = 'block';
  editTaskForm.reset();
}

// Edit task form submission
editTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskId = document.getElementById('edit-task-id').value;
  const updates = {
      title: document.getElementById('edit-task-title').value,
      description: document.getElementById('edit-task-description').value,
      dueDate: document.getElementById('edit-task-due-date').value,
      priority: document.getElementById('edit-task-priority').value,
      category: document.getElementById('edit-task-category').value
  };

  taskManager.editTask(taskId, updates);
  renderTasks();
  hideEditForm();
});

// Cancel edit button
cancelEditButton.addEventListener('click', hideEditForm);

// Drag and drop event handlers
function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.id);
  setTimeout(() => e.target.classList.add('dragging'), 0);
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const draggedTaskId = e.dataTransfer.getData('text/plain');
  const draggedTask = document.querySelector(`[data-id="${draggedTaskId}"]`);
  const dropTarget = e.target.closest('.task-item');

  if (draggedTask && dropTarget && draggedTask !== dropTarget) {
      const taskItems = Array.from(taskList.children);
      const oldIndex = taskItems.indexOf(draggedTask);
      const newIndex = taskItems.indexOf(dropTarget);

      if (oldIndex < newIndex) {
          taskList.insertBefore(draggedTask, dropTarget.nextSibling);
      } else {
          taskList.insertBefore(draggedTask, dropTarget);
      }

      taskManager.reorderTasks(oldIndex, newIndex);
  }

  draggedTask.classList.remove('dragging');
  dropTarget.classList.remove('drag-over');
}

function dragEnter(e) {
  e.target.closest('.task-item').classList.add('drag-over');
}

function dragLeave(e) {
  e.target.closest('.task-item').classList.remove('drag-over');
}


// Initial render
renderTasks();
updateSummary();
