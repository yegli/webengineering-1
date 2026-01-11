// Model: Application Constant & related functions
const animalsAndHabitatsMap = {
  Parrot: 'Rain Forest',
  Gorilla: 'Rain Forest',
  'Polar Bear': 'Polar',
  Lemming: 'Polar',
  Heron: 'Wetland',
  Otter: 'Wetland',
  Dingo: 'Desert',
  Camel: 'Desert',
  Crab: 'Marine',
  Dolphin: 'Marine',
  Elephant: 'Grassland',
  Bison: 'Grassland',
};

function getNewRandomAnimal(currentAnimal) {
  const allAnimals = Object.keys(animalsAndHabitatsMap);
  const newAnimals = [];
  allAnimals.forEach((animal) => {
    if (animal !== currentAnimal) newAnimals.push(animal);
  });
  const newCurrentAnimalIndex = Math.floor(Math.random() * newAnimals.length);
  return newAnimals[newCurrentAnimalIndex];
}

// test
// function checkEachAnimalSelectedAtLeastOnce (tries) {
//   const allAnimals = Object.keys(animalsAndHabitatsMap);
//   const selectCounts = [];
//   let notFoundCount = 0;
//   const incAnimalSelectCount = function (animal) {
//     animalFound = false;
//     for (let i=0; i< allAnimals.length; i++) {
//       if (allAnimals[i] === animal ) {
//         animalFound = true;
//         selectCounts[i] = (selectCounts[i] || 0) + 1;
//       }
//     }
//     if (!animalFound) {
//       notFoundCount++;
//     }
//   }
//   let currentAnimal;
//   for (let i=0; i<tries; i++) {
//     currentAnimal = getNewRandomAnimal(currentAnimal);
//     incAnimalSelectCount(currentAnimal);
//   }
//   const selectedAllAnimals = selectCounts.every(count => count !== undefined);
//   console.log({selectedAllAnimals}, {notFoundCount}, selectCounts);
// }
// checkEachAnimalSelectedAtLeastOnce(100);

function habitatMatchesP(animal, habitat) {
  return animalsAndHabitatsMap[animal] === habitat;
}

// Model: Application State
let showingQuestion = false;
let currentAnimal;
const answerLog = [];
let timer;

// View: Static DOM References
const introSection = document.querySelector('#intro');
const questionForm = document.querySelector('#question');
const startButton = document.querySelector('#start');
const answerLogSection = document.querySelector('#answer-log');
const timerProgressElement = document.querySelector('#timer');
const animalOutputElement = document.querySelector('#animal');
const habitatSelectElement = document.querySelector('#habitat');
const answersList = document.querySelector('#answers');

// View: Templates
function answerLogHtmlString() {
  return answerLog
    .map((answerLogEntry) => (
      `<li data-animal="${answerLogEntry.animal}">Habitat of ${answerLogEntry.animal} is ${
        answerLogEntry.answer} ${(answerLogEntry.answerCorrect) ? '✅' : '❌'}</li>`))
    .join('');
}

function habitatOptionsHtmlString() {
  const habitats = [];
  Object.values(animalsAndHabitatsMap)
    .forEach((habitat) => {
      if (!habitats.some((registeredHabitat) => registeredHabitat === habitat)) {
        habitats.push(habitat);
      }
    });
  return habitats
    .map((habitat) => (
      `<option value="${habitat}">${habitat}</option>`))
    .join('');
}

// View getter/setter-functions
function getLogListItemAnimal(logListItem) {
  return logListItem.dataset.animal;
}

function resetHabitatSelector() {
  habitatSelectElement.value = 'unknown';
}

function getSelectedHabitat() {
  return (timer === 0) ? 'timeout' : habitatSelectElement.value;
}

// View update functions
// function updateView() {
//   if (showingQuestion) {
//     introSection.classList.add("hidden");
//     questionForm.classList.remove("hidden");
//     answerLogSection.classList.add("hidden");
//     animalOutputElement.value = currentAnimal;
//   } else {
//     introSection.classList.remove("hidden");
//     questionForm.classList.add("hidden");
//     if (answerLog.length > 0) {
//       answerLogSection.classList.remove("hidden");
//       answersList.innerHTML = answerLogHtmlString();
//     } else {
//       answerLogSection.classList.add("hidden");
//     }
//   }
// }

function updateView() {
  if (showingQuestion) {
    introSection.hidden = true;
    questionForm.hidden = false;
    answerLogSection.hidden = true;
    animalOutputElement.value = currentAnimal;
  } else {
    introSection.hidden = false;
    questionForm.hidden = true;
    if (answerLog.length > 0) {
      answerLogSection.hidden = false;
      answersList.innerHTML = answerLogHtmlString();
    } else {
      answerLogSection.hidden = true;
    }
  }
}

function updateTimerDisplay() {
  timerProgressElement.value = timer;
}

// Controller: Timer

function terminateQuestionAnswering() {
  answerLog.push({
    // todo: what does the { on the above line signify?
    // A: The object literal syntax is used to define an object
    animal: currentAnimal,
    answer: getSelectedHabitat(),
    answerCorrect: habitatMatchesP(currentAnimal, getSelectedHabitat()),
  });
  showingQuestion = false;
  // todo: what is the effect of setting the above variable?
  // A: state of showingQuestion is picked up by updateView()
  updateView();
}

let currentTimeout;

function startNextCountdown() {
  currentTimeout = setTimeout(() => {
    timer -= 1; // todo: what is this doing? A: decreasing timer
    updateTimerDisplay();
    if (timer > 0) {
      startNextCountdown();
      // todo: why is this neither a recursion nor an endless loop?
      // A: startNextCountdown stats a task next task is started
      // if this task is completed (left the main-thread)
    } else {
      terminateQuestionAnswering();
    }
  }, 100);
}

function startCountdown() {
  timer = 100;
  updateTimerDisplay();
  startNextCountdown();
}

function stopCountdown() {
  clearTimeout(currentTimeout);
  // todo: Why is this needed?
  // A: Otherwise startNextCountdown would keep running
}

function startQuestionAnswering(animal) {
  showingQuestion = true;
  currentAnimal = animal || getNewRandomAnimal();
  // todo: Why is the above needed?
  // A: Only call getNewRandomAnimal if no animal is provided in the call.
  resetHabitatSelector();
  // todo: Why is the above needed?
  // A: set habitats selector back to "I dont know"
  updateView();
  startCountdown();
}

// Controller: Event Handler
function handleStart() {
  startQuestionAnswering();
}

function handleCheckAnswer(e) {
  e.preventDefault();
  // todo: why is the above not needed here?
  // A: only needed for button click event handler
  stopCountdown();
  terminateQuestionAnswering();
}

function handleRedoQuestion(event) {
  const selectedLogItem = event.target;
  startQuestionAnswering(getLogListItemAnimal(selectedLogItem) || currentAnimal);
}

// Initialization: Attach Event Handler
startButton.addEventListener('click', handleStart);
answersList.addEventListener('click', handleRedoQuestion);
habitatSelectElement.addEventListener('change', handleCheckAnswer);

function initApp() {
  habitatSelectElement.insertAdjacentHTML('beforeend', habitatOptionsHtmlString());
  updateView();
}

initApp();
