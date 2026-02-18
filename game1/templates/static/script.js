const video = document.getElementById("video");
const moodText = document.getElementById("mood");
const lessonText = document.getElementById("lessonText");
const pointsDisplay = document.getElementById("points");
const levelDisplay = document.getElementById("level");

let points = 0;
let level = 1;
let currentMood = "neutral";

// 🎥 Start Camera
async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
}

// 📦 Load Models
async function loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/static/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/static/models");
}

// 😊 Detect Mood
async function detectMood() {
    const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

    if (!detection) return;

    const expressions = detection.expressions;

    currentMood = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
    );

    moodText.innerText = "Mood: " + currentMood;

    recommendLesson(currentMood);
}

// 📚 Emotion-based Lesson Recommendation
function recommendLesson(mood) {

    if (mood === "happy") {
        lessonText.innerText = "🔥 Try Advanced Math Problems!";
    }
    else if (mood === "sad") {
        lessonText.innerText = "😊 Let's revise basic concepts with fun examples!";
    }
    else if (mood === "angry") {
        lessonText.innerText = "🧘 Try a short fun quiz to relax.";
    }
    else {
        lessonText.innerText = "📘 Continue with normal lesson.";
    }
}

// 🎮 Quiz System
function startQuiz() {

    let difficulty = "easy";

    if (currentMood === "happy") difficulty = "hard";
    if (currentMood === "neutral") difficulty = "medium";
    if (currentMood === "sad") difficulty = "easy";

    const quizBox = document.getElementById("quizBox");

    let question, answer;

    if (difficulty === "easy") {
        question = "5 + 3 = ?";
        answer = 8;
    }
    else if (difficulty === "medium") {
        question = "12 × 4 = ?";
        answer = 48;
    }
    else {
        question = "25 × 12 = ?";
        answer = 300;
    }

    quizBox.innerHTML = `
        <p>${question}</p>
        <input type="number" id="userAnswer">
        <button onclick="checkAnswer(${answer})">Submit</button>
    `;
}

// 🏆 Check Answer
function checkAnswer(correctAnswer) {
    const userAnswer = document.getElementById("userAnswer").value;

    if (parseInt(userAnswer) === correctAnswer) {
        alert("Correct! 🎉 +10 points");
        points += 10;
    } else {
        alert("Wrong! Try again.");
    }

    updateProgress();
}

// 📊 Update Level & Points
function updateProgress() {
    level = Math.floor(points / 50) + 1;

    pointsDisplay.innerText = points;
    levelDisplay.innerText = level;
}

// 🚀 Initialize
(async () => {
    await loadModels();
    await startCamera();
    setInterval(detectMood, 2000);
})();
