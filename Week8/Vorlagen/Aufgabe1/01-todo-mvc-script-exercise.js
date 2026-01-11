// Model
let toDoList = [];
let selectedToDoIndex = -1;

// View
const toDoTxt = document.querySelector('#toDoTxt');
const addBtn = document.querySelector('#addBtn');
const toDoList = document.querySelector('#toDoList');
const remBtn = document.querySelector('#remBtn');

function toDoElementHTMLString(toDo, index) {
  // TODO 2.1: Im HTML String sollte im <li> element neben dem Text des toDo (im Content)
  // auch noch im data-index attribut der index des To-Do Objekts in der Liste gespeichert werden
  // So kann das entsprechende To-Do zu einem ELement wiedergefunden werden.
  // Weiterhin sollte ein Attribut tabindex="0" enthalten sein,
  // so kann das Element mit der Tastatur selektiert werden

//  return ( ... );
}

function getToDoListElementsAsHTMLString(renderToDoList) {
  // TODO 2.2: Loop über alle Elemente der Liste.
  //           HTML Strings aller ToDos sammeln und zusammen zurückgeben
  // Optional: wenn die Liste leer ist einen speziellen String zurückgeben

  // return ...
}

function updateView() {
  // TODO 2.3.1: Gesamten Inhalt von toDoList ersetzen mit dem Output
  //             von getToDoListElementsAsHTMLString
  // TODO 2.3.2: toDoTxt fokussieren
  // TODO 2.3.3: remBtn disablen da Focus auf Text und nicht auf einem ToDO

}

// Controller
toDoTxt.addEventListener('input', () => {
  // TODO 3: wenn toDoTxt leer ist addBtn disablen sonst enable
  // Hier gibt es zwei Optionen: Shortcut direkter Update Button
  // "Schöner": Update Variable im Modell dann Aufruf updateView()
  // Erweiterung von UpdateView, so dass die Variable genutzt wird
});

addBtn.addEventListener('click', () => {
  // add new toDoItem
  // TODO 4: neues ToDO Objekt {toDoText: ...} einfügen
  //         toDoTxt leeren und entsprechend addBtn disabled ( Nötig wegen shortcut im 3)
  //         updateView aufrufen
  toDoList.push({toDoText: toDoTxt.value});
  toDoTxt.value = '';
  addBtn.disabled = true;
  updateView();
});

toDoList.addEventListener('click', (e) => {
  // catches bubbling click event from toDoItems to select / unselect
  if (e.target.matches('li')) {
    e.target.focus(); // "manuelles" Fokussieren
  }
});

toDoList.addEventListener('focusin', (e) => {
  // catches bubbling click event from toDoItems to select
  if (e.target.matches('li')) {
    // TODO 5 selectedToDoIndex korrekt setzen
    // Tipp: dataset nutzen
    // selectedToDoIndex = ...
    remBtn.disabled = false; // nötig wegen shortcut im 3 !
  }
});

function removeSelectedToDo() {
  // TODO 6 ToDo mit Index selectedToDoIndex aus der Liste
  // toDoList entfernen. selectedToDoIndex auf -1 setzen
}

toDoList.addEventListener('keypress', (e) => {
  // catches return key hit while focus is on a toDoItem
  if (e.target.matches('li') && e.keyCode === 13) {
    removeSelectedToDo();
    updateView();
  }
});

remBtn.addEventListener('click', () => {
  removeSelectedToDo();
  updateView();
});

// init
updateView();
