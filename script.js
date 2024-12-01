const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openFormBtn = document.getElementById("open-task-form-btn");
const closeFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descInput = document.getElementById("description-input");

const taskData = JSON.parse(sessionStorage.getItem("data")) || [];
let currentTask = {};

const removeSpecialChars = (str) => {
  return str.trim().replace(/[^A-Za-z0-9\-\s]/g, '')
}

const addOrUpdateTask = () => {
   if(!titleInput.value.trim()) {
    alert("Please provide a title");
    return;
  }
  
  if (!dateInput.value.trim()) {
    alert("Please provide a date")
    return;
  }
  
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  const taskObj = {
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descInput.value,
  };

  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }

  sessionStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer();
  reset();
};

const updateTaskContainer = () => {
  tasksContainer.innerHTML = "";

  taskData.forEach(
    ({ id, title, date, description }) => {
        (tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <h2 class="wrap title">${title}</h2>
          <p class="date">${date}</p>
          <p class="wrap desc">${description}</p>
          <button onclick="editTask(this)" type="button" class="mod-task-btn"><i class="fa-solid fa-pen"></i></button>
          <button onclick="deleteTask(this)" type="button" class="mod-task-btn"><i class="fa-solid fa-trash"></i></button> 
        </div>
      `)
    }
  );
};

/** if there is existing task data, update the tasks container **/
if (taskData.length) {
  updateTaskContainer();
}

const deleteTask = (btn) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === btn.parentElement.id
  );

  btn.parentElement.remove();
  taskData.splice(dataArrIndex, 1);
  sessionStorage.setItem("data", JSON.stringify(taskData));
}

const editTask = (btn) => {
    const dataArrIndex = taskData.findIndex(
    (item) => item.id === btn.parentElement.id
  );

  currentTask = taskData[dataArrIndex];

  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descInput.value = currentTask.description;

  addOrUpdateTaskBtn.innerHTML = "<i class="fa-solid fa-check"></i>";

  taskForm.classList.toggle("hidden");  
}

const reset = () => {
  addOrUpdateTaskBtn.innerHTML = "<i class="fa-solid fa-plus"></i>";
  titleInput.value = "";
  dateInput.value = "";
  descInput.value = "";
  taskForm.classList.toggle("hidden");
  currentTask = {};
}

openFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);

closeFormBtn.addEventListener("click", () => {
  const formInputsContainValues = titleInput.value || dateInput.value || descInput.value;
  const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descInput.value !== currentTask.description;

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});

cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset()
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addOrUpdateTask();
});
