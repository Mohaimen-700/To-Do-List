let todo = JSON.parse(localStorage.getItem("todo")) || [];
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");

document.addEventListener("DOMContentLoaded", function () {
  addButton.addEventListener("click", addTask);
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
  });
  deleteButton.addEventListener("click", deleteAllTasks);
  displayTasks();
});

function addTask() {
  const newTask = todoInput.value.trim();
  if (newTask !== "") {
    todo.push({ text: newTask, disabled: false });
    saveCheckboxState(todo.length - 1, false); 
    saveToLocalStorage();
    todoInput.value = "";
    displayTasks();
  }
}

function displayTasks() {
  todoList.innerHTML = "";
  todo.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.draggable = true;
    li.dataset.index = index;
    li.innerHTML = `
      <div class="todo-container">
        <input type="checkbox" class="todo-checkbox" id="input-${index}" ${item.disabled ? "checked" : ""}>
        <p class="todo-text ${item.disabled ? "disabled" : ""}">${item.text}</p>
        <div class="button-container">
          <button class="edit-btn" onclick="editTask(${index})">Edit</button>
          <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
        </div>
      </div>
    `;
    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragover", dragOver);
    li.addEventListener("drop", drop);
    todoList.appendChild(li);
    const checkbox = li.querySelector('.todo-checkbox');
    checkbox.checked = loadCheckboxState(index);
    checkbox.addEventListener('change', function() {
      saveCheckboxState(index, this.checked);
    });
  });
  updateTodoCount();
}

function updateTodoCount() {
  todoCount.textContent = todo.length;
}

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}

function deleteAllTasks() {
  todo = [];
  saveToLocalStorage();
  displayTasks();
}

function deleteTask(index) {
  todo.splice(index, 1);
  saveToLocalStorage();
  displayTasks();
}

function editTask(index) {
  const newTask = prompt("Edit your task:", todo[index].text);
  if (newTask !== null && newTask.trim() !== "") {
    todo[index].text = newTask.trim();
    saveToLocalStorage();
    displayTasks();
  }
}

function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.dataset.index);
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const draggedIndex = event.dataTransfer.getData("text/plain");
  const targetIndex = event.target.closest("li").dataset.index;
  if (draggedIndex !== targetIndex) {
    const draggedItem = todo.splice(draggedIndex, 1)[0];
    todo.splice(targetIndex, 0, draggedItem);
    saveToLocalStorage();
    displayTasks();
  }
}

function saveCheckboxState(index, checked) {
  localStorage.setItem(`checkbox-${index}`, checked);
}

function loadCheckboxState(index) {
  const state = localStorage.getItem(`checkbox-${index}`);
  return state === "true"; 
}
