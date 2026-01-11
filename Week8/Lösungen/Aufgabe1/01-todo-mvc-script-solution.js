// Model
let toDoListItems = [];
let selectedToDoIndex = -1;

// View
const toDoTxt = document.querySelector('#toDoTxt');
const addBtn = document.querySelector('#addBtn');
const toDoList = document.querySelector('#toDoList');
const remBtn = document.querySelector('#remBtn');

function toDoElementHTMLString(toDo, index) {
  return `<li tabindex="0" data-index="${index}">${toDo.toDoText}</li>`;
}

function getToDoListElementsAsHTMLString(renderToDoList) {
  if (renderToDoList.length === 0) {
    return '<li>Deine ToDo Liste ist leer. Erfasse das erste ToDo</li>';
  }
  // The code below essentially does the following:
  // let listContentHTMLString = '';
  // for (let i = 0; i < toDoList.length; i++) {
  //   listContentHTMLString += toDoElementHTMLString(toDoList[i], i);
  // }
  // return listContentHTMLString;
  return renderToDoList
    .map(toDoElementHTMLString)
    .join('');
}

function updateView() {
  toDoList.innerHTML = getToDoListElementsAsHTMLString(toDoListItems);
  toDoTxt.focus();
  remBtn.disabled = true;
}

// Controller
toDoTxt.addEventListener('input', () => {
  addBtn.disabled = !(toDoTxt.value); // shortcut
});

addBtn.addEventListener('click', (e) => {
  // add new toDoItem
  e.preventDefault();
  toDoListItems.push({toDoText: toDoTxt.value});
  toDoTxt.value = '';
  addBtn.disabled = true;
  updateView();
});

toDoList.addEventListener('focusin', (e) => {
  // catches bubbling click event from toDoItems to select
  if (e.target.matches('li')) {
    selectedToDoIndex = parseInt(e.target.dataset.index, 10);
    remBtn.disabled = false;
  }
});

toDoList.addEventListener('keypress', (e) => {
  // catches return key hit while focus is on a toDoItem
  if (e.target.matches('li') && e.keyCode === 13) {
    removeSelectedToDo();
    updateView();
  }
});

function removeSelectedToDo() {
  const newToDoList = [];
  for (let i = 0; i < toDoListItems.length; i++) {
    if (i !== selectedToDoIndex) {
      newToDoList.push(toDoListItems[i]);
    }
  }
  toDoListItems = newToDoList;
  // shorter: toDoList.splice(selectedToDoIndex, 1);
  selectedToDoIndex = -1;
}

remBtn.addEventListener('click', () => {
  removeSelectedToDo();
  updateView();
});

// init
updateView();
