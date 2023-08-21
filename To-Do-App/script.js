const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const editForm = document.getElementById("editForm");
const editInput = document.getElementById("editInput");
const editDate = document.getElementById("editDate");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let tasks = [];
let editingTask = null; // To keep track of the task being edited

// Load tasks from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    addTaskBtn.addEventListener("click", addTask);
    saveEditBtn.addEventListener("click", saveEdit);
    cancelEditBtn.addEventListener("click", cancelEdit);
});

function addTask() {
    const taskText = taskInput.value;
    if (taskText.trim() === "") return;

    const task = {
        text: taskText,
        completed: false,
        date: getCurrentDateAndTime(),
    };

    tasks.push(task);
    addTaskToList(task);
    saveTasksToLocalStorage();

    taskInput.value = "";
}

function addTaskToList(task) {
    const li = document.createElement("li");
    li.innerHTML = `
    <span class="task-text ${task.completed ? "completed" : ""}">${task.text}</span>
    <span class="task-date">${task.date}</span>
    <span class="edit-btn">Edit</span>
    <span class="delete-btn">Delete</span>
  `;

    const editBtn = li.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
        handleEditClick(li);
    });

    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
        taskList.removeChild(li);
        removeTaskFromTasks(task);
        saveTasksToLocalStorage();
    });

    taskList.appendChild(li);
}

function handleEditClick(taskElement) {
    const taskIndex = Array.from(taskList.children).indexOf(taskElement);
    const task = tasks[taskIndex];

    editInput.value = task.text;
    editingTask = task; // Store the task being edited
    editDate.textContent = `Created: ${task.date}`;
    editForm.classList.remove("hidden");
}

function saveEdit() {
    if (!editingTask) return;

    editingTask.text = editInput.value;
    updateTaskInTasks(editingTask);
    saveTasksToLocalStorage();
    clearEditForm();
    renderTasks();
}

function cancelEdit() {
    clearEditForm();
}

function clearEditForm() {
    editingTask = null;
    editInput.value = "";
    editDate.textContent = "";
    editForm.classList.add("hidden");
}

function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskInTasks(updatedTask) {
    tasks = tasks.map(task => {
        if (task.text === editingTask.text) {
            return updatedTask;
        }
        return task;
    });
}

function removeTaskFromTasks(task) {
    tasks = tasks.filter(t => t.text !== task.text);
}

function loadTasks() {
    const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasksFromLocalStorage;
    tasks.forEach(task => {
        addTaskToList(task);
    });
}

function getCurrentDateAndTime() {
    const now = new Date();
    const options = { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric" };
    return now.toLocaleString("en-US", options);
}
