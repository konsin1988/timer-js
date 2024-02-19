const start = document.getElementById("start");
const reset = document.getElementById("reset");
const step = document.getElementById("step");
const second = document.getElementById("seconds");
const minute = document.getElementById("minutes");
const hour = document.getElementById("hours");
const listSteps = document.getElementById("list_steps");

const steps = [];
let timeId;
let isRunning = false;
let counter = 0;
let counterPrev = 0;

/******************************  OBJECT GENERATOR ********/

function Time() {
  this.hour = 0;
  this.minute = 0;
  this.second = 0;
  this.setTime = function (counter) {
    this.hour = Math.floor(counter / (60 * 60));
    this.minute = Math.floor((counter - this.hour * 60 * 60) / 60);
    this.second = lessThenTen(counter - this.hour * 60 * 60 - this.minute * 60);
    this.minute = lessThenTen(this.minute);
    this.hour = lessThenTen(this.hour);
  };
  this.setClock = function () {
    second.textContent = this.second;
    minute.textContent = this.minute;
    hour.textContent = this.hour;
  };
}

/*********************** FUNCTIONS ************** */

function lessThenTen(num) {
  if (num < 10) {
    return "0" + num;
  } else {
    return num;
  }
}

/************************* START - STOP ************** */

start.onclick = function () {
  if (!isRunning) {
    let time = new Time();
    reset.classList.remove("hidden_btn");
    step.classList.remove("hidden_btn");
    start.textContent = "stop";
    timeId = setInterval(function () {
      ++counter;
      time.setTime(counter);
      time.setClock();
    }, 1000);
    isRunning = true;
  } else {
    clearInterval(timeId);
    start.textContent = "start";
    isRunning = false;
  }
};

/**************************** STEP ***************** */

step.onclick = function () {
  let time = new Time();
  time.setTime(counter);
  let timeDelta = new Time();
  timeDelta.setTime(counter - counterPrev);
  counterPrev = counter;
  const newStep = {
    full: `${time.hour}:${time.minute}:${time.second}`,
    delta: `${timeDelta.hour}:${timeDelta.minute}:${timeDelta.second}`,
  };
  steps.push(newStep);

  render(steps);
};

/*********************** RESET ******************* */

reset.onclick = function () {
  clearInterval(timeId);
  counter = 0;
  counterPrev = 0;
  start.textContent = "start";
  reset.classList.add("hidden_btn");
  step.classList.add("hidden_btn");
  let time = new Time();
  time.setTime(counter);
  time.setClock();
  steps.length = 0;
  render(steps);
};

/*********************** GETTEMP ****************** */

function getTemp(num, full, delta) {
  return `<li data-index="${num}">
              <span class="numbers">${num + 1}. </span>
              <span class="numbers">Full... </span>
              <span class="numbers">${full}  </span>
              <span class="numbers">Delta... </span>
              <span class="numbers"> ${delta} </span>
            </li>`;
}

/************************ RENDER STEPS ************ */
function render(array) {
  listSteps.innerHTML = "";

  for (let i = 0; i < array.length; i++) {
    listSteps.insertAdjacentHTML(
      "beforeend",
      getTemp(i, array[i].full, array[i].delta)
    );
  }
}
render(steps);

/************************  STEPS OPACITY  *************/

window.addEventListener("scroll", (e) => {
  for (let i = 0; i < steps.length; i++) {
    console.log(document.querySelector(`[data-index="${i}"]`));
  }
});
