let playerScore = 0;
let gkScore = 0;
let currentShot = 0;
const defaultMaxShots = 5;
let isPlaying = false;
let gameEnded = false;

// Переменные для шкалы силы
let power = 0;
let powerDirection = 1;
let powerInterval = null;
let currentPowerValue = 0;

const sndKick = new Audio("https://mixkit.co");
const sndGoal = new Audio("https://mixkit.co");
const sndSave = new Audio("https://mixkit.co");
const sndWhistle = new Audio("https://mixkit.co");
const sndMiss = new Audio("https://mixkit.co"); // Звук промаха

const ball = document.getElementById("ball");
const goalkeeper = document.getElementById("goalkeeper");
const resultText = document.getElementById("result");
const playerScoreEl = document.getElementById("player-score");
const gkScoreEl = document.getElementById("gk-score");
const difficultySelect = document.getElementById("difficulty");
const buttons = document.querySelectorAll(".controls button");
const powerBar = document.getElementById("power-bar");
const dotsContainer = document.getElementById("dots-container");

// Запуск анимации шкалы силы
function startPowerBar() {
  if (gameEnded || isPlaying) return;
  clearInterval(powerInterval);
  power = 0;
  powerDirection = 1;

  powerInterval = setInterval(() => {
    power += 4 * powerDirection;
    if (power >= 100) {
      power = 100;
      powerDirection = -1;
    }
    if (power <= 0) {
      power = 0;
      powerDirection = 1;
    }
    powerBar.style.width = power + "%";
  }, 25);
}

// Запускаем шкалу сразу при старте страницы
window.onload = () => {
  startPowerBar();
};

function getGoalkeeperDirection(playerPosition) {
  const diff = difficultySelect.value;
  const directions = ["left", "center", "right"];

  if (diff === "easy") {
    if (Math.random() < 0.15) return playerPosition;
    const wrongDirections = directions.filter((d) => d !== playerPosition);
    return wrongDirections[Math.floor(Math.random() * wrongDirections.length)];
  } else if (diff === "hard") {
    if (Math.random() < 0.6) return playerPosition;
    const otherDirections = directions.filter((d) => d !== playerPosition);
    return otherDirections[Math.floor(Math.random() * otherDirections.length)];
  } else {
    return directions[Math.floor(Math.random() * directions.length)];
  }
}

function kick(playerPosition) {
  if (isPlaying || gameEnded) return;
  isPlaying = true;

  // Останавливаем шкалу силы и фиксируем значение
  clearInterval(powerInterval);
  currentPowerValue = power;
  difficultySelect.disabled = true;

  sndKick.currentTime = 0;
  sndKick
    .play()
    .catch((e) => console.log("Нажмите на экран для активации звуков"));

  goalkeeper.className = "goalkeeper";
  ball.className = "ball";

  // Проверка на перебор силы (более 85% — удар выше ворот)
  const isTooStrong = currentPowerValue > 85;

  setTimeout(() => {
    const gkPosition = getGoalkeeperDirection(playerPosition);
    goalkeeper.classList.add(`gk-${gkPosition}`);

    if (isTooStrong) {
      // Мяч улетает выше ворот
      ball.classList.add(`ball-${playerPosition}`, "ball-high");
    } else {
      ball.classList.add(`ball-${playerPosition}`);
    }

    setTimeout(() => {
      // Динамически ищем или создаем точку на табло (для режима Золотого гола)
      let currentDot = document.getElementById(`dot-${currentShot}`);
      if (!currentDot && !gameEnded) {
        currentDot = document.createElement("div");
        currentDot.className = "dot";
        currentDot.id = `dot-${currentShot}`;
        dotsContainer.appendChild(currentDot);
      }

      if (isTooStrong) {
        // ВЫШЕ ВОРОТ
        resultText.innerHTML =
          "<span style='color: #f44336;'>ВЫШЕ ВОРОТ! Слишком сильный удар! 🦅</span>";
        if (currentDot) currentDot.classList.add("miss");
        sndMiss.currentTime = 0;

        sndMiss.play();
      } else if (playerPosition === gkPosition) {
        // СЕЙВ
        goalkeeper.innerText = "🧤";
        resultText.innerHTML =
          "<span style='color: #ffca28;'>ВРАТАРЬ ОТБИЛ! 🧤</span>";
        gkScore++;
        gkScoreEl.innerText = gkScore;
        if (currentDot) currentDot.classList.add("miss");
        sndSave.currentTime = 0;
        sndSave.play();
      } else {
        // ГОЛ
        goalkeeper.innerText = "😭";
        resultText.innerHTML =
          "<span style='color: #66bb6a;'>ГОООООЛ! 🎉⚽</span>";
        playerScore++;
        playerScoreEl.innerText = playerScore;
        if (currentDot) currentDot.classList.add("goal");
        sndGoal.currentTime = 0;
        sndGoal.play();
      }

      currentShot++;

      setTimeout(() => {
        // Проверка завершения игры или переход к Золотому голу
        if (currentShot >= defaultMaxShots) {
          if (playerScore === gkScore) {
            // Режим Золотого Гола
            resultText.innerHTML =
              "<span style='color: #ffeb3b;'>Ничья! Играем до первого промаха (Золотой гол)! ⚔️</span>";
            prepareNextShot();
          } else {
            endGame();
          }
        } else {
          prepareNextShot();
        }
      }, 1400);
    }, 350);
  }, 50);
}

function prepareNextShot() {
  goalkeeper.className = "goalkeeper";
  goalkeeper.innerText = "🧍‍♂️";
  ball.className = "ball";
  if (!gameEnded) {
    resultText.innerText = `Удар ${currentShot + 1}. Накапливайте силу и бейте!`;
    isPlaying = false;
    startPowerBar(); // Перезапускаем бегущую шкалу силы
  }
}

function endGame() {
  gameEnded = true;
  clearInterval(powerInterval);
  sndWhistle.play();

  buttons.forEach((btn) => (btn.disabled = true));

  let finalMessage = "";
  if (playerScore > gkScore) {
    finalMessage = `🏆 ВЫ ПОБЕДИЛИ! Счет: ${playerScore}:${gkScore}`;
  } else {
    finalMessage = `❌ Бот выиграл серию! Счет: ${playerScore}:${gkScore}`;
  }

  resultText.innerHTML = `
        <div style='font-size:1.6rem; color:#fff; margin-bottom:10px;'>${finalMessage}</div>
        <button onclick='resetGame()' class='restart-btn'>Играть снова</button>
    `;
}

function resetGame() {
  playerScore = 0;
  gkScore = 0;
  currentShot = 0;
  isPlaying = false;
  gameEnded = false;

  playerScoreEl.innerText = "0";
  gkScoreEl.innerText = "0";
  difficultySelect.disabled = false;
  resultText.innerText = "Выберите направление для первого удара!";

  goalkeeper.className = "goalkeeper";
  goalkeeper.innerText = "🧍‍♂️";
  ball.className = "ball";

  buttons.forEach((btn) => (btn.disabled = false));

  // Перерисовываем стандартные 5 точек табло
  dotsContainer.innerHTML = `
        <div class="dot" id="dot-0"></div>
        <div class="dot" id="dot-1"></div>
        <div class="dot" id="dot-2"></div>
        <div class="dot" id="dot-3"></div>
        <div class="dot" id="dot-4"></div>
    `;

  startPowerBar();
}
