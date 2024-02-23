const start = document.getElementById("start");
const reset = document.getElementById("reset");
const step = document.getElementById("step");
const second = document.getElementById("seconds");
const minute = document.getElementById("minutes");
const hour = document.getElementById("hours");
const listSteps = document.getElementById("list_steps");
const setOneButton = document.getElementById("one_button_set");

const steps = [];
let timeId;
let isRunning = false;
let counter = 0;
let counterPrev = 0;
let startHidden =
  document.querySelector(".stops").getBoundingClientRect().top + 50;
let endHidden =
  document.querySelector("body").getBoundingClientRect().bottom - 50;
let sizeCounter = "body";

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
    setOneButton.classList.remove("one_button");
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
    hidden: false,
  };
  steps.push(newStep);

  render(steps);
  window.scroll(top);
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
  setOneButton.classList.add("one_button");
  render(steps);
};

/*********************** GETTEMP ****************** */

function getTemp(num, full, delta, hidden) {
  return `<li data-index="${num}" class="list_elevent ${
    hidden ? "opacity_li" : ""
  } ">
              <span class="numbers">${num + 1}) </span>
              <span class="numbers">Full... </span>
              <span class="numbers">${full}  </span>
              <span class="numbers">Delta... </span>
              <span class="numbers"> ${delta} </span>
            </li>`;
}

/************************ RENDER STEPS ************ */
function render(array) {
  listSteps.innerHTML = "";

  for (let i = array.length - 1; i >= 0; i--) {
    listSteps.insertAdjacentHTML(
      "beforeend",
      getTemp(i, array[i].full, array[i].delta, array[i].hidden)
    );
  }

  for (let i = 0; i < array.length; i++) {
    testMapping(i);
  }
}
render(steps);

/************************  STEPS OPACITY  *************/

function testMapping(index) {
  if (
    document.querySelector(`[data-index="${index}"]`).getBoundingClientRect()
      .bottom < startHidden ||
    document.querySelector(`[data-index="${index}"]`).getBoundingClientRect()
      .bottom > endHidden
  ) {
    document
      .querySelector(`[data-index="${index}"]`)
      .classList.add("opacity_li");
    steps[index].hidden = true;
  } else {
    document
      .querySelector(`[data-index="${index}"]`)
      .classList.remove("opacity_li");
    steps[index].hidden = false;
  }
}

window.addEventListener("scroll", (e) => {
  for (let i = 0; i < steps.length; i++) {
    testMapping(i);
  }
});

window.addEventListener("resize", function (steps) {
  // window.scroll(top);
  if (device.desktop()) {
    endHidden =
      document.querySelector("body").getBoundingClientRect().bottom - 50;
  } else {
    endHidden = window.screen.height - 50;
  }
  startHidden =
    document.querySelector(".buttons").getBoundingClientRect().bottom + 100;
  for (let i = 0; i < steps.length; i++) {
    testMapping(i);
  }
});
