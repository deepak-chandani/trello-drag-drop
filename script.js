import DEFAULT_DATA from "./data/default_task_data";
import setupDragAndDrop from "./dragAndDrop";

console.log("it works", DEFAULT_DATA);
const key = "__TRELLO_TASK_DATA__";


// initialize
const data = loadTaskData();
renderTaskList();
bindFormSubmitHandler();

function loadTaskData() {
  const dataString = localStorage.getItem(key);
  if (!dataString) {
    return DEFAULT_DATA;
  }

  return JSON.parse(dataString);
}

function saveTaskData(){
    localStorage.setItem(key, JSON.stringify(data))
}

function renderTaskList(onlyColumnId) {
  for (let k in data) {
    const columnObject = data[k];
    const columnId = columnObject.id;
    if (onlyColumnId && columnId !== onlyColumnId) {
      continue;
    }

    const columnContainer = document.querySelector(`[data-lane-id="${columnId}"]`);
    columnContainer.innerHTML = "";

    const tasks = columnObject.tasks;
    tasks.forEach((t) => {
      const taskElement = createTaskItemElement(t);
      columnContainer.append(taskElement);
    });
  }

  saveTaskData()
}

function createTaskItemElement({ id, title }) {
  const html = `<div id="${id}" class="task" data-draggable>
    ${title}
  </div>`;

  const div = document.createElement("div");
  div.innerHTML = html.trim();
  return div.firstChild;
}

function bindFormSubmitHandler() {
  const forms = document.querySelectorAll("[data-task-form]");
  console.log(forms);
  forms.forEach((f) => f.addEventListener("submit", handleFormSubmit));
}

function handleFormSubmit(e) {
  e.preventDefault();
  const title = e.target.elements.title.value;
  const columnId = e.target.closest(".lane").querySelector("[data-lane-id]")
    .dataset["laneId"];
  console.log(`add ${title} inside ${columnId} column`);

  e.target.elements.title.value = "";

  if (!data[columnId]) {
    return;
  }

  const newTask = {
    id: Date.now(),
    title,
  };
  data[columnId].tasks.push(newTask);
  renderTaskList(columnId);
}

function onDragComplete(dropEvent) {
  console.log(dropEvent);
  const {startZone, endZone, dragElement, index} = dropEvent
  const taskId = Number(dragElement.id)
  const startColumnId = startZone.dataset['laneId']
  const endColumnId = endZone.dataset['laneId']

  // remove item from startZone's lane-id
  let newTask
  const updatedList = []
  data[startColumnId].tasks.forEach(task => {
    if(task.id === taskId) {
      newTask = task
    } else {
      updatedList.push(task)
    }
  })
  data[startColumnId].tasks = updatedList

  // add item in endZone's lane-id at index
  data[endColumnId].tasks.splice(index, 0, newTask)
  // data[endColumnId].tasks = (data[endColumnId].tasks, index, newTask)

  saveTaskData()
  console.log("updated Task data onDragComplete", data)
}

setupDragAndDrop(onDragComplete);
