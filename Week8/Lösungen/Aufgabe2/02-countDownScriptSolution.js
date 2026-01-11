let counter = 10;
const outputElement = document.querySelector('output');

function doCountDown() {
  if (counter > 0) {
    setTimeout(() => {
      counter -= 1;
      outputElement.innerHTML = counter;
      doCountDown();
    }, 300);
  } else {
    outputElement.innerHTML = 'done';
  }
}

function startCountDown() {
  counter = 10;
  outputElement.innerHTML = String(counter);
  doCountDown();
}

document.querySelector('button')
  .addEventListener('click', startCountDown);
