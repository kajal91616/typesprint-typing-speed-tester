
const passages = [
    "Learning to type quickly takes regular practice and patience. Focus on accuracy first, and your speed will gradually improve with time.",
    "Programming teaches us how to solve problems logically. Small steps, consistent practice, and curiosity can help us become better developers.",
    "Technology makes communication and learning easier. Using our time wisely helps us develop useful skills and achieve our daily goals.",
    "Success comes from consistent effort rather than perfection. Keep practicing every day, learn from mistakes, and celebrate your progress."
];

const passageElement = document.getElementById("passage");
const typingInput = document.getElementById("typingInput");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const messageElement = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

let targetText = "";
let timeLeft = 60;
let timerInterval = null;
let testStarted = false;
let testFinished = false;
let startTime = 0;

function choosePassage() {
    const randomIndex = Math.floor(Math.random() * passages.length);
    return passages[randomIndex];
}

function displayPassage() {
    targetText = choosePassage();

    passageElement.innerHTML = "";

    targetText.split("").forEach((character, index) => {
        const span = document.createElement("span");
        span.textContent = character;

        if (index === 0) {
            span.classList.add("current");
        }

        passageElement.appendChild(span);
    });
}

function startTest() {
    if (testStarted || testFinished) {
        return;
    }

    testStarted = true;
    startTime = Date.now();

    messageElement.textContent = "Test in progress. Keep typing!";

    timerInterval = setInterval(() => {
        const elapsedSeconds = Math.floor(
            (Date.now() - startTime) / 1000
        );

        timeLeft = Math.max(0, 60 - elapsedSeconds);
        timerElement.textContent = timeLeft + "s";

        updateStats();

        if (timeLeft <= 0) {
            finishTest("Time is up! Here are your results.");
        }
    }, 200);
}

function updateStats() {
    const typedText = typingInput.value;
    let correctCharacters = 0;

    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === targetText[i]) {
            correctCharacters++;
        }
    }

    const totalTyped = typedText.length;

    const accuracy = totalTyped === 0
        ? 100
        : (correctCharacters / totalTyped) * 100;

    const elapsedMinutes = (60 - timeLeft) / 60;

    const wpm = elapsedMinutes > 0
        ? Math.round((correctCharacters / 5) / elapsedMinutes)
        : 0;

    wpmElement.textContent = wpm;
    accuracyElement.textContent = accuracy.toFixed(1) + "%";

    updatePassageHighlight(typedText);
}

function updatePassageHighlight(typedText) {
    const characters = passageElement.querySelectorAll("span");

    characters.forEach((span, index) => {
        span.classList.remove("correct", "incorrect", "current");

        if (index < typedText.length) {
            if (typedText[index] === targetText[index]) {
                span.classList.add("correct");
            } else {
                span.classList.add("incorrect");
            }
        } else if (index === typedText.length) {
            span.classList.add("current");
        }
    });
}

function finishTest(message) {
    if (testFinished) {
        return;
    }

    testFinished = true;
    clearInterval(timerInterval);

    typingInput.disabled = true;

    if (timeLeft <= 0) {
        timeLeft = 0;
        timerElement.textContent = "0s";
    }

    updateStats();

    messageElement.textContent = message;
}

function restartTest() {
    clearInterval(timerInterval);

    timeLeft = 60;
    testStarted = false;
    testFinished = false;
    startTime = 0;

    typingInput.value = "";
    typingInput.disabled = false;

    timerElement.textContent = "60s";
    wpmElement.textContent = "0";
    accuracyElement.textContent = "100%";
    messageElement.textContent = "Start typing to begin the test.";

    displayPassage();
    typingInput.focus();
}

typingInput.addEventListener("input", () => {
    if (testFinished) {
        return;
    }

    if (typingInput.value.length > 0) {
        startTest();
    }

    updateStats();

    if (typingInput.value.length >= targetText.length) {
        finishTest("Passage completed! Here are your results.");
    }
});

restartBtn.addEventListener("click", restartTest);

// Initialize the application
restartTest();
