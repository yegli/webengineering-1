import todoService from "./todo-service.js";


// View


const toDoTxt = document.querySelector('#toDoTxt');
const addBtn = document.querySelector('#addBtn');
const toDoListElm = document.querySelector('#toDoListElm');
const remBtn = document.querySelector('#remBtn');

function toDoElementHTMLString(toDo, index) {
    return (
	`<li tabindex="0"
         data-index="${index}" data-id="${toDo.id}">${toDo.value}</li>`
    );
}

function toDoListContentHTMLString(renderToDoList) {
    if (renderToDoList.length === 0) {
	return '<li><h3>Deine ToDo Liste ist leer. Erfasse das erste ToDo</h3></li>';
    }
    return renderToDoList
	.map(toDoElementHTMLString)
	.join('');
}

async function updateView() {
    const response = await  todoService.getAll();

	toDoListElm.innerHTML = toDoListContentHTMLString(response); // updated needed if shared (XSS)
    toDoTxt.focus();
    remBtn.disabled = true;
}

// Controller
let selectedId = undefined;

toDoTxt.addEventListener('input', () => {
    addBtn.disabled = !(toDoTxt.value); // shortcut
});

addBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    todoService.add(toDoTxt.value);
     
	toDoTxt.value = '';
	addBtn.disabled = true;
    
    await updateView();
});

toDoListElm.addEventListener('click', (e) => {
    // catches bubbling click event from toDoItems to select / unselect
    if (e.target.matches('li')) {
	e.target.focus(); // update view not possible
    }
});

toDoListElm.addEventListener('focusin', (e) => {
    // catches bubbling click event from toDoItems to select
    if (e.target.matches('li')) { // update view not possible
	    selectedId = parseInt(e.target.dataset.id, 10);
	    remBtn.disabled = false;
    }
});

async function removeSelectedToDo(id) {
   await todoService.remove(selectedId)
   await updateView();
}

toDoListElm.addEventListener('keypress', async (e) => {
    // catches return key hit while focus is on a toDoItem
    if (e.target.matches('li') && e.keyCode === 13) {
        await removeSelectedToDo();
    }
});

remBtn.addEventListener('click', async (e) => {
    await removeSelectedToDo();
});

// init
updateView();
