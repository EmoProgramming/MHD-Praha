let state = "idle";

let tramRoutes = [];
let score = 0;
let rightAnswer = true;
let prev_number;
let start = true;
let number;
let dataSaveMessage;
let showDataSaveMessage = false;

let seconds = 0;
let timer;



function addAllTramRoutes() {
    for (let i = 1; i < 27; i++) {
        if (i == 14) {
            continue;
        }
        tramRoutes.push(i);
    }
    tramRoutes.push(34);
}

function getRandomAndRemove(numbers) {
    const randomIndex = Math.floor(Math.random() * numbers.length);

    const removed = numbers.splice(randomIndex, 1)[0];

    return removed;
}

function chooseTramRoute(tramRoutes) {
    return getRandomAndRemove(tramRoutes);
}

function idleState() {
    HTMLForIdle();
}

function playingState() {
    if (!endOfQuiz()) {
        number = chooseTramRoute(tramRoutes);

        HTMLForPlaying();

        if (!start) {
            if (rightAnswer) {
                quiz.innerHTML += showAnswer("RIGHT ANSWER");
            } else {
                quiz.innerHTML += showAnswer("WRONG ANSWER");
            }
        }

        //console.log(number);
        drawRoute("L" + number + "_1", routes);
        prev_number = number;
        
    } else {
        state = "end";
        stopTimer();
        render();
    }
}

function endState() {
    HTMLForEnd();
}


function endOfQuiz() {
    return (tramRoutes.length <= 0);
}

function showScore() {
    return "<div class='score'>SCORE " + score + "</div>";
}

function showState(state) {
    return "<h1>" + state + "</h1>";
}

function showInput(placeholder, id, name) {
    return '<input placeholder="' + placeholder + '" id="' + id + '" name="' + name + '"></input>';
}

function showButton(onclickPar, buttonName) {
    return '<button onclick="' + onclickPar + '">' + buttonName + '</button>';
}

function showAnswer(answer) {
    return "<div>" + answer + "</div>";
}

function showMessage() {
    return "<div>" + message + "</div>";
}

function showRules() {
    const rules = document.getElementById("rules");

    const h2 = document.createElement("h2");
    h2.textContent = "RULES";

    const paragraph = document.createElement("p");
    paragraph.textContent = "There are 26 tram links in Prague and your goal is to guess correctly the most you can. At the end you can add your result to leaderboard. The result is based od number of correct guesses and time spent during quiz. Priority has correctnes.";

    rules.appendChild(h2);
    rules.appendChild(paragraph);
}

function hideRules() {
    document.getElementById("rules").innerHTML = "";
}

function showWarning() {
    const quiz = document.getElementById("quiz");

    const paragraph = document.createElement("p");
    paragraph.textContent = dataSaveMessage;
    paragraph.classList.add("warning");

    quiz.appendChild(paragraph);


}

function HTMLForIdle() {
    let buttonName = "Start";
    let onclickPar = `startGame()`;
    let state = "Quiz";
    quiz.innerHTML = showState(state) + showButton(onclickPar, buttonName);
    if (showDataSaveMessage) {
        showWarning();
    }
    showRules();
}

function HTMLForPlaying() {
    hideRules();
    let onclickPar =  `checkRight(${number})`;
    let buttonName = "Next";
    let state = "Playing";
    let forInput = "answer"
    quiz.innerHTML = showState(state) + showInput(forInput, forInput, forInput) + 
    showButton(onclickPar, buttonName) + showScore();
}

function HTMLForEnd() {
    let buttonName = "Play Again";
    let onclickPar = `restart()`;
    let placeholder = "Enter nickname"
    let forInput = "nickname";
    quiz.innerHTML = showState("End Of Game") + showInput(placeholder, forInput, forInput) +
    showButton(`saveData()`, "Save Score And Restart")+ "<br>" + showScore();
   
}

function render() {
    const quiz = document.getElementById("quiz");

    if (state === "idle") {
        idleState();
    }

    else if (state === "playing") {
        playingState();
    }

    else if (state === "end") {
        endState();
    }
}


function startTimer() {
    document.getElementById("timer").textContent = seconds;

    timer = setInterval(() => {
        seconds++;
        document.getElementById("timer").textContent = seconds;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function resetTimer() {
    seconds = 0;
    document.getElementById("timer").textContent = seconds;
}

function startGame() {
    state = "playing";
    startTimer();
    render();
}

function restart() {
    state = "idle";
    addAllTramRoutes();
    score = 0;
    rightAnswer = true;
    start = true;
    resetTimer();
    render();
}


function saveData() {
    if (score != 0) {
        let nickname = document.getElementById("nickname").value;
        fetch("save.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                score: score,
                time: seconds,
                nickname: nickname
            })
        });
        dataSaveMessage = "Result was saved. Check https://www.ms.mff.cuni.cz/~granskye/leaderboard.php"
    } else {
        dataSaveMessage = "Only score higher than 0 is saved. Sorry :("
        
    }
    showDataSaveMessage = true;

    restart();
}

function checkRight(number) {
    let answer = document.getElementById("answer").value;

    rightAnswer = false;
    if (answer == number) {
        score += 1;
        rightAnswer = true;
    }

    render();
}

addAllTramRoutes();
render();