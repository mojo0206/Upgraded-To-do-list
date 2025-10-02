const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

const loginBtn = document.getElementById("login-btn");
const authContainer = document.getElementById("auth-container");
const todoContainer = document.getElementById("todo-container");
const userGreeting = document.getElementById("user-greeting");

let currentUser = null;

// ---------------- AUTH ----------------
loginBtn.addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter username and password!");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (!users[username]) {
    users[username] = { password: password, tasks: [] };
    alert("Account created successfully!");
  } else if (users[username].password !== password) {
    alert("Wrong password");
    return;
  }

  localStorage.setItem("users", JSON.stringify(users));
  currentUser = username;

  authContainer.style.display = "none";
  todoContainer.style.display = "block";
  userGreeting.textContent = `Welcome, ${username}!`;

  loadTasks();
});

// ---------------- TASK FUNCTIONS ----------------
function updateCounters() {
  const completedTasks = document.querySelectorAll("li.completed").length;
  const uncompletedTasks = document.querySelectorAll("li:not(.completed)").length;
  completedCounter.textContent = completedTasks;
  uncompletedCounter.textContent = uncompletedTasks;
}

function saveTasks() {
  if (!currentUser) return;
  let users = JSON.parse(localStorage.getItem("users")) || {};
  const tasks = [];
  document.querySelectorAll("#list-container li").forEach(li => {
    tasks.push({
      text: li.querySelector(".task-text").textContent,
      completed: li.classList.contains("completed"),
      date: li.getAttribute("data-date")
    });
  });
  users[currentUser].tasks = tasks;
  localStorage.setItem("users", JSON.stringify(users));
}

function loadTasks() {
  listContainer.innerHTML = "";
  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[currentUser]) return;

  users[currentUser].tasks.forEach(task => {
    createTaskElement(task.text, task.completed, task.date);
  });
  updateCounters();
}

function createTaskElement(taskText, isCompleted = false, date = null) {
  const li = document.createElement("li");
  const timestamp = date || new Date().toLocaleString();

  li.setAttribute("data-date", timestamp);
  li.innerHTML = `
    <label>
      <input type="checkbox" ${isCompleted ? "checked" : ""}>
      <span class="task-text">${taskText}</span>
    </label>
    <span class="task-date">${timestamp}</span>
    <span class="edit-btn">Edit</span>
    <span class="delete-btn">Delete</span>
  `;
  listContainer.appendChild(li);

  const checkBox = li.querySelector("input");
  const editBtn = li.querySelector(".edit-btn");
  const deleteBtn = li.querySelector(".delete-btn");
  const taskSpan = li.querySelector(".task-text");

  if (isCompleted) li.classList.add("completed");

  checkBox.addEventListener("click", () => {
    li.classList.toggle("completed", checkBox.checked);
    updateCounters();
    saveTasks();
  });

  editBtn.addEventListener("click", () => {
    const update = prompt("Edit Task:", taskSpan.textContent);
    if (update !== null && update.trim() !== "") {
      taskSpan.textContent = update.trim();
      li.classList.remove("completed");
      checkBox.checked = false;
      updateCounters();
      saveTasks();
    }
  });

  deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this task?")) {
      li.remove();
      updateCounters();
      saveTasks();
    }
  });

  updateCounters();
  saveTasks();
}

function addTask() {
  const task = inputBox.value.trim();
  if (!task) {
    alert("Please write down a task");
    return;
  }
  createTaskElement(task, false);
  inputBox.value = "";
}

// Enter key to add task
inputBox.addEventListener("keypress", function (e) {
  if (e.key === "Enter") addTask();
});

// Initialize counters
document.addEventListener("DOMContentLoaded", () => {
  updateCounters();
});
