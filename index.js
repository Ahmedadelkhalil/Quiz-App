let questionCount = document.querySelector(".count span");
let spanCourt = document.querySelector(".spans");
let currentIndex = 0;
let rightAnswers = 0;
let quArea = document.querySelector(".question-area");
let ansArea = document.querySelector(".answers-area");
let submitting = document.querySelector(".btn");
let spansContainer = document.querySelector(".spans_timeout");
let evaluation = document.querySelector(".evaluation");
let timeOut = document.querySelector(".timeout");
let setTimeOutInterval;

function getquestions() {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let objData = JSON.parse(this.responseText);
      let qucount = objData.length;
      countQU(qucount);
      //   console.log(objData);
      countDownTimer(10, qucount);
      questionData(objData[currentIndex], qucount);
      submitting.onclick = function () {
        let rightAnswer = objData[currentIndex]["right-Ans"];
        currentIndex++;
        checkRightAns(rightAnswer, qucount);
        quArea.innerHTML = "";
        ansArea.innerHTML = "";
        questionData(objData[currentIndex], qucount);
        handleBullets();
        showResult(qucount);
        clearInterval(setTimeOutInterval);
        countDownTimer(10, qucount);
      };
    }
  };
  request.open("GET", "html_question.json", true);
  request.send();
}
getquestions();

function countQU(num) {
  questionCount.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let createSpans = document.createElement("span");
    spanCourt.appendChild(createSpans);
    if (i === 0) {
      createSpans.classList.add("on");
    }
  }
}

function questionData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");

    let questionHeading = document.createTextNode(obj.title);

    questionTitle.appendChild(questionHeading);
    quArea.appendChild(questionTitle);

    for (let j = 1; j <= 4; j++) {
      let dataAnswersContainer = document.createElement("div");
      dataAnswersContainer.className = `ans-${j}`;
      let inp = document.createElement("input");

      inp.name = "ans";
      inp.type = "radio";
      inp.id = `Answer-${j}`;
      inp.dataset.Answer = obj[`Answer-${j}`];

      if (j === 1) {
        inp.checked = true;
      }

      let createlabel = document.createElement("label");

      createlabel.htmlFor = `Answer-${j}`;

      let labelText = document.createTextNode(obj[`Answer-${j}`]);

      createlabel.appendChild(labelText);
      dataAnswersContainer.appendChild(inp);
      dataAnswersContainer.appendChild(createlabel);
      ansArea.appendChild(dataAnswersContainer);
    }
  }
}

function checkRightAns(rAnswer, qucount) {
  let Answers = document.getElementsByName("ans");
  let choosenAns;

  for (let i = 0; i < Answers.length; i++) {
    if (Answers[i].checked) {
      choosenAns = Answers[i].dataset.Answer;
    }
  }
  if (rAnswer === choosenAns) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bullSpan = document.querySelectorAll(".spans span");

  let bullArr = Array.from(bullSpan);

  bullArr.forEach((span, index) => {
    if (currentIndex === index) {
      span.classList.add("on");
    }
  });
}

function showResult(count) {
  let theResult;
  if (currentIndex === count) {
    quArea.remove();
    ansArea.remove();
    submitting.remove();
    spansContainer.remove();

    if (rightAnswers === count) {
      theResult = `<span class="perfect">Perfect</span>, All Is Done Correctly`;
    } else if (rightAnswers > count / 2 && rightAnswers < count) {
      theResult = `<span class="good">Good</span>, You Have Answered ${rightAnswers} out of ${count}`;
    } else {
      theResult = `<span class="bad">Not Good Enough</span>, You Just Answered ${rightAnswers} out of ${count}`;
    }

    evaluation.innerHTML = theResult;
    evaluation.style.textAlign = "center";
    evaluation.style.padding = "20px";
    evaluation.style.backgroundColor = "#fff";
  }
}

function countDownTimer(duration, count) {
  if (currentIndex < count) {
    setTimeOutInterval = setInterval(function () {
      let minutes = parseInt(duration / 60);
      let seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

      timeOut.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(setTimeOutInterval);
        // console.log("finished");
        submitting.click();
      }
    }, 1000);
  }
}
