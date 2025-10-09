document.addEventListener("DOMContentLoaded", function () {
  renderTasks(getTasks());
});

function renderTasks(tasks) {
  const taskList = document.querySelector(".task__list");
  taskList.innerHTML = "";
  const taskPending = document.getElementById("pending-count");
  const taskDone = document.getElementById("done-count");
  let pendingCount = (doneCount = 0);

  if (tasks.length === 0) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task__item--blank");
    taskItem.innerHTML = `<p>Hiện không có công việc nào. Hãy thêm công việc</p>`;
    taskList.appendChild(taskItem);
  } else {
    tasks.forEach((task) => {
      const taskItem = document.createElement("li");
      taskItem.classList.add("task__item");
      taskItem.setAttribute("data-id", `${task.id}`);
      if (task.completed) {
        doneCount++;
        taskItem.classList.add("completed");
        taskItem.innerHTML = `
            <input type="checkbox" class="task__checkbox" checked aria-label="Đánh dấu hoàn thành công việc"/>
            `;
      } else {
        pendingCount++;
        taskItem.innerHTML = `
            <input type="checkbox" class="task__checkbox" aria-label="Đánh dấu hoàn thành công việc"/>
            `;
      }
      taskItem.innerHTML += `
      <span class="task__name">${task.name}</span>
      <div class="task__actions">
        <button type="button" class="task__btn task__btn--edit">Sửa</button>
        <button type="button" class="task__btn task__btn--delete" >Xóa</button>
      </div>
        `;

      taskList.appendChild(taskItem);
    });
  }
  taskPending.textContent = pendingCount;
  taskDone.textContent = doneCount;
}

function getTasks() {
  let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  return savedTasks;
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(nameTask) {
  let tasks = getTasks();
  let newTask = {
    name: nameTask,
    completed: false,
    id: genIdTask(),
  };
  tasks.unshift(newTask);
  saveTasks(tasks);
  renderTasks(tasks);
}

function deleteTask(id) {
  const popupComfirm = document.querySelector(".popup-comfirm");
  const popupTitle = document.querySelector(".popup-comfirm__title");
  const popupMess = document.querySelector(".popup-comfirm__mess");
  const agreeBtn = document.querySelector(".popup-comfirm__btn--agree");
  const cancelBtn = document.querySelector(".popup-comfirm__btn--cancel");

  popupTitle.innerHTML = "Xóa Công Việc";
  popupMess.innerHTML = "Bạn có chắc muốn xóa công việc này không?";
  popupComfirm.classList.add("active");

  agreeBtn.addEventListener(
    "click",
    () => {
      let tasks = getTasks();
      let newTasks = tasks.filter((task) => task.id !== id);
      saveTasks(newTasks);
      renderTasks(newTasks);

      popupComfirm.classList.remove("active");
    },
    { once: true }
  );

  cancelBtn.addEventListener(
    "click",
    () => {
      popupComfirm.classList.remove("active");
    },
    { once: true }
  );
}

function editTask(id) {
  const modalEditTask = document.querySelector(".modal-edit-task");
  const saveBtn = document.querySelector(".edit-task__btn--save");
  const cancelBtn = document.querySelector(".edit-task__btn--cancel");
  const inputName = document.querySelector(".edit-task__input");

  let tasks = getTasks();
  const oldName = tasks.find((task) => task.id === id).name;
  inputName.value = oldName;

  modalEditTask.classList.add("active");

  inputName.addEventListener("input", (e) => {
    if (e.target.value.trim() === oldName || e.target.value.trim() === "") {
      saveBtn.disabled = true;
    } else if (isDuplicateTaskName(e.target.value.trim())) {
      saveBtn.disabled = true;
    } else {
      saveBtn.disabled = false;
    }
  });

  saveBtn.addEventListener(
    "click",
    () => {
      const newName = document.querySelector(".edit-task__input").value;
      let newTask = tasks.map((task) => {
        if (task.id === id) {
          return { ...task, name: newName };
        } else {
          return task;
        }
      });
      saveTasks(newTask);
      renderTasks(newTask);
      modalEditTask.classList.remove("active");
    },
    { once: true }
  );

  cancelBtn.addEventListener(
    "click",
    () => {
      modalEditTask.classList.remove("active");
    },
    { once: true }
  );
}

function toggleTask(checked, id) {
  let tasks = getTasks();

  let newTask = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, completed: checked };
    } else {
      return task;
    }
  });
  saveTasks(newTask);
  renderTasks(newTask);
}

function isDuplicateTaskName(nameTask) {
  let tasks = getTasks();
  let duplicate = tasks.some((task) => task.name === nameTask);
  return duplicate;
}

function genIdTask() {
  let id = crypto.randomUUID();
  return id;
}


function isDuplicateTask(nameTask) {
    let tasks = getTasks();
        let dublicateTask = tasks.filter((task) => task.name === nameTask)
        {

        }
}

const forms = document.querySelectorAll("form");
forms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });
});



const addTaskBtn = document.querySelector(".task__btn--add");
addTaskBtn.addEventListener("click", () => {
  const errName = document.querySelector(".task__err-name");
  const inputName = document.querySelector(".task__input");
  let nameTask = inputName.value.trim();

  if (nameTask === "") {
    inputName.style.border = "2px solid red";
    errName.textContent = "Vui lòng nhập tên công việc!";
    inputName.value = "";
  } else if (isDuplicateTaskName(nameTask)) {
    inputName.style.border = "2px solid red";
    errName.textContent = "Công việc đã tồn tại!";
  } else {
    addTask(nameTask);
    inputName.value = "";
  }
});

const taskList = document.querySelector(".task__list");
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("task__btn--delete")) {
    const idTask = e.target.closest(".task__item").getAttribute("data-id");

    deleteTask(idTask);
  }
  if (e.target.classList.contains("task__btn--edit")) {
    const idTask = e.target.closest(".task__item").getAttribute("data-id");

    editTask(idTask);
  }
  if (e.target.classList.contains("task__checkbox")) {
    const idTask = e.target.closest(".task__item").getAttribute("data-id");
    const checked = e.target
      .closest(".task__item")
      .querySelector(".task__checkbox").checked;

    toggleTask(checked, idTask);
  }
});

const taskInput = document.querySelector(".task__input");
taskInput.addEventListener("focus", (e) => {
  document.querySelector(".task__err-name").innerHTML = "";
  e.target.style.border = "2px solid blue";

  taskInput.addEventListener("blur", (e) => {
    e.target.style.border = "2px solid rgba(0, 0, 0, 0.3)";
  });
});


