// Accessing the elements by their IDs and assigning to constants
const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

let taskData = JSON.parse(localStorage.getItem('tasks')) || [];
let currentTask = {};

// Function to save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(taskData));
}

// Function to render tasks to the DOM
function renderTasks() {
  tasksContainer.innerHTML = '';
  taskData.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');
    taskDiv.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.date}</p>
      <p>${task.description}</p>
      <button onclick="editTask('${task.id}')">Edit</button>
      <button onclick="deleteTask('${task.id}')">Delete</button>
    `;
    tasksContainer.appendChild(taskDiv);
  });
}

// Function to handle form submission
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskObj = {
    id: currentTask.id ? currentTask.id : `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
  };

  const dataArrIndex = taskData.findIndex((item) => item.id === taskObj.id);

  if (dataArrIndex > -1) {
    // Update existing task
    taskData[dataArrIndex] = taskObj;
  } else {
    // Add new task
    taskData.push(taskObj);
  }

  saveTasks();
  renderTasks();
  taskForm.classList.add('hidden');
  taskForm.reset();
  currentTask = {};
});

// Function to handle opening the task form
openTaskFormBtn.addEventListener("click", () => {
  taskForm.classList.toggle("hidden");
  currentTask = {};
});

// Function to handle closing the task form, showing a confirmation dialog
closeTaskFormBtn.addEventListener("click", () => {
  confirmCloseDialog.showModal();
});

// Function to handle canceling the confirmation dialog
cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

// Function to handle discarding changes and closing the task form
discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  taskForm.classList.add("hidden");
  taskForm.reset();
  currentTask = {};
});

// Function to edit a task
window.editTask = (id) => {
  currentTask = taskData.find(task => task.id === id);
  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;
  taskForm.classList.remove('hidden');
};

// Function to delete a task
window.deleteTask = (id) => {
  taskData = taskData.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
};

// Initial render of tasks
renderTasks();
