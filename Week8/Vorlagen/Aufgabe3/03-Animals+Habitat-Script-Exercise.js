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
  // const allAnimals = ... ; //hint: Object.keys
  // const newAnimals = ... ; // hint: empty array
  // TODO loop through allAnimals and push all animals != currentAnimal
  // const newCurrentAnimalIndex = Math.floor(Math.random() * newAnimals.length);
  // return ...; // return the element in newAnimals at newCurrentAnimalIndex
}

// test (OPTIONAL exercise)
// function checkEachAnimalSelectedAtLeastOnce (tries) {
//   const allAnimals = Object.keys(animalsAndHabitatsMap);
//   const selectCounts = [];
//   let notFoundCount = 0;
//   const incAnimalSelectCount = function (animal) {
//     animalFound = false;
//     for (let i=0; i< allAnimals.length; i++) {
//       if (allAnimals[i] === animal ) {
//         //TODO remember that animal was found
//         //TODO increase selectCounts at index i (attention: initial value is undefined);
//       }
//     }
//     if (!animalFound) {
//       TODO increase notFoundCount;
//     }
//   }
//   let currentAnimal;
//   for (let i=0; i<tries; i++) {
//     currentAnimal = getNewRandomAnimal(currentAnimal);
//     incAnimalSelectCount(currentAnimal);
//   }
//   const selectedAllAnimals = ... //check that every element of selectCounts is not undefined
//   console.log({selectedAllAnimals}, {notFoundCount}, selectCounts);
// }
// checkEachAnimalSelectedAtLeastOnce(100);

function habitatMatchesP(animal, habitat) {
  // TODO check and return if the provided <habitat> matches the habitat listed for
  //  <animal> in animalsAndHabitatsMap
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

// TODO (OPTIONAL) rewrite each of the above queries assuming that
// none of the elements in the HTML had an id-property
// use at least one query that uses another starting point than document

// View: Templates
function answerLogHtmlString() {
  // TODO use the map over the elements of the answer log to apply a
  // template string generating entries such as
  // <li data-animal="Otter">Habitat of Otter is Desert ❌</li>
  // join and return the result.
}

function habitatOptionsHtmlString() {
  const habitats = [];
  // todo iterate over the values in animalsAndHabitatsMap
  // collect each value ONCE in habitats
  // e.g. push a value only to habitats if the value is not yet in habitats
  // habitats.some(checkFn) can be used for this

  // todo: now create for each habitat in habitats
  // the HTML string for the corresponding options element
  // e.g. <option value="Rain Forest">Rain Forest</option>
  // use again the map-template-join pattern and return the value
}

// View getter/setter-functions
function getLogListItemAnimal(logListItem) {
  // todo return the animal stored in the data-animal property of the logListItem element
}

function resetHabitatSelector() {
  // todo select the "Don't know" option in the habitatSelectElement
}

function getSelectedHabitat() {
  // todo get the value of the option selected in the habitatSelectElement
  // EXCEPT if timer === 0 (timeout) then return "timeout"
}

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
let currentTimeout;

function terminateQuestionAnswering() {
  answerLog.push({ // todo: what does the { on this line signify?
    animal: currentAnimal,
    answer: getSelectedHabitat(),
    answerCorrect: habitatMatchesP(currentAnimal, getSelectedHabitat()),
  });
  showingQuestion = false; // todo: what is the effect of setting this variable?
  updateView();
}

function startNextCountdown() {
  currentTimeout = setTimeout(() => {
    timer -= 1; // todo: what is this doing?
    updateTimerDisplay();
    if (timer > 0) {
      startNextCountdown(); // todo: why is this neither a recursion nor an endless loop?
    } else {
      terminateQuestionAnswering();
    }
  }, 100);
}

function stopCountdown() {
  clearTimeout(currentTimeout); // todo: Why is this needed?
}

function startCountdown() {
  timer = 100;
  updateTimerDisplay();
  startNextCountdown();
}

function startQuestionAnswering(animal) {
  showingQuestion = true;
  currentAnimal = animal || getNewRandomAnimal(); // todo: Why is this needed?
  resetHabitatSelector(); // todo: Why is this needed?
  updateView();
  startCountdown();
}

// Controller: Event Handler
function handleStart() {
  startQuestionAnswering();
}

function handleCheckAnswer(e) {
  // e.preventDefault(); //todo why is this not needed here?
  stopCountdown();
  terminateQuestionAnswering();
}

function handleRedoQuestion(event) {
  const selectedLogItem = event.target;
  // selectedLogItem might not be an li-item.
  // Explain why, and why this is not a problem
  startQuestionAnswering(getLogListItemAnimal(selectedLogItem) || currentAnimal);
}

// Initialization: Attach Event Handler
//  startButton.addEventListener(/*todo*/, handleStart);
//  answersList.addEventListener(/*todo*/, handleRedoQuestion);
//  habitatSelectElement.addEventListener(/*todo*/, handleCheckAnswer);

function initApp() {
  // init habitatSelectElement (use insertAdjacentHTML)
  updateView();
}

initApp(); // why needed?
