document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskButton = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const taskCounter = document.getElementById("task-counter");
  const clearCompletedBtn = document.getElementById("clear-completed-btn");

  loadTasks();
  updateCounter();

  addTaskButton.addEventListener("click", addTask);

  taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  });

  taskList.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    const taskItem = target?.closest("li");
    if (!taskItem) return;

    if (target.classList.contains("complete-btn")) {
      taskItem.classList.toggle("completed");
      saveTasks();
      updateCounter();
    } else if (target.classList.contains("delete-btn")) {
      taskList.removeChild(taskItem);
      saveTasks();
      updateCounter();
    } else if (target.classList.contains("edit-btn")) {
      startEditTask(taskItem);
    } else if (target.classList.contains("save-btn")) {
      saveEditTask(taskItem);
    } else if (target.classList.contains("cancel-btn")) {
      cancelEditTask(taskItem);
    }
  });

  clearCompletedBtn.addEventListener("click", () => {
    document.querySelectorAll("#task-list li.completed").forEach((item) => {
      taskList.removeChild(item);
    });
    saveTasks();
    updateCounter();
  });

  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const taskItem = createTaskElement(taskText);
    taskList.appendChild(taskItem);

    saveTasks();
    updateCounter();
    taskInput.value = "";
  }

  function createTaskElement(text, completed = false) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    if (completed) taskItem.classList.add("completed");

    const taskContent = document.createElement("span");
    taskContent.textContent = text;

    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("task-buttons");

    const completeButton = document.createElement("button");
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    completeButton.classList.add("complete-btn");

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editButton.classList.add("edit-btn");

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.classList.add("delete-btn");

    buttonGroup.appendChild(completeButton);
    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);

    taskItem.appendChild(taskContent);
    taskItem.appendChild(buttonGroup);

    return taskItem;
  }

  function startEditTask(taskItem) {
    const span = taskItem.querySelector("span");
    const currentText = span.textContent;

    const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;

    const buttonGroup = taskItem.querySelector(".task-buttons");
    buttonGroup.innerHTML = "";

    const saveButton = document.createElement("button");
    saveButton.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
    saveButton.classList.add("save-btn");

    const cancelButton = document.createElement("button");
    cancelButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    cancelButton.classList.add("cancel-btn");

    buttonGroup.appendChild(saveButton);
    buttonGroup.appendChild(cancelButton);

    taskItem.insertBefore(input, span);
    taskItem.removeChild(span);
  }

  function saveEditTask(taskItem) {
    const input = taskItem.querySelector("input[type='text']");
    const newText = input.value.trim();
    if (newText === "") return;

    const span = document.createElement("span");
    span.textContent = newText;

    const buttonGroup = taskItem.querySelector(".task-buttons");
    buttonGroup.innerHTML = "";

    const completeButton = document.createElement("button");
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    completeButton.classList.add("complete-btn");

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editButton.classList.add("edit-btn");

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.classList.add("delete-btn");

    buttonGroup.appendChild(completeButton);
    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);

    taskItem.insertBefore(span, input);
    taskItem.removeChild(input);

    saveTasks();
  }

  function cancelEditTask(taskItem) {
    const input = taskItem.querySelector("input[type='text']");
    const originalText = input.value;

    const span = document.createElement("span");
    span.textContent = originalText;

    taskItem.insertBefore(span, input);
    taskItem.removeChild(input);

    const buttonGroup = taskItem.querySelector(".task-buttons");
    buttonGroup.innerHTML = "";

    const completeButton = document.createElement("button");
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    completeButton.classList.add("complete-btn");

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editButton.classList.add("edit-btn");

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.classList.add("delete-btn");

    buttonGroup.appendChild(completeButton);
    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);
  }

  function updateCounter() {
    const total = document.querySelectorAll("#task-list li").length;
    const completed = document.querySelectorAll(
      "#task-list li.completed"
    ).length;
    taskCounter.textContent = `${completed}/${total} task completed`;
  }

  function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#task-list li").forEach((item) => {
      tasks.push({
        text: item.querySelector("span").textContent,
        completed: item.classList.contains("completed"),
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach((task) => {
      const taskItem = createTaskElement(task.text, task.completed);
      taskList.appendChild(taskItem);
    });
  }
});
