const predictions = [
  "Сегодня идеальный день, чтобы написать крутой код! 💻",
  "Тебя ждет неожиданный, но очень приятный сюрприз. 🎁",
  "Твои старания скоро принесут отличные результаты! 🚀",
  "Кто-то думает о тебе прямо сейчас и улыбается. 😊",
  "Сделай паузу и выпей чаю, ты отлично справляешься! ☕",
  "Твой код запустится с первого раза без единой ошибки! 🐛✨",
];
const colors = [
  "rgba(255,234,167,0.85)",
  "rgba(250,177,160,0.85)",
  "rgba(116,185,255,0.85)",
  "rgba(162,155,254,0.85)",
  "rgba(85,239,196,0.85)",
];

function getRankName(level) {
  if (level >= 30) return "🌌 ИИ ОВЕРЛОРД / БОГ СЕТИ 🌌";
  if (level >= 25) return "👑 Архитектор Метавселенной";
  if (level >= 20) return "🚀 Основатель Кибер-Корпорации";
  if (level >= 15) return "💼 Технический Директор (CTO)";
  if (level >= 10) return "👔 Тимлид / Кибер-Семпай";
  if (level >= 7) return "🛠️ Фуллстек Ниндзя";
  if (level >= 5) return "🎨 Фронтенд Мастер";
  if (level >= 3) return "⚡ Уверенный скриптер";
  if (level >= 2) return "🧑‍💻 Джуниор-верстальщик";
  return "👶 Нубик";
}

// Загрузка состояния игры из памяти браузера
let xp = Number(localStorage.getItem("g_xp")) || 0;
let currentLevel = Number(localStorage.getItem("g_level")) || 1;
let clicksNeeded = Number(localStorage.getItem("g_needed")) || 5;
let critTokens = Number(localStorage.getItem("g_tokens")) || 0;

// Состояние 4-х бустов
let hasClickUpgrade = localStorage.getItem("g_b_click") === "true";
let hasAutoUpgrade = localStorage.getItem("g_b_auto") === "true";
let hasLuckUpgrade = localStorage.getItem("g_b_luck") === "true";
let hasMegaUpgrade = localStorage.getItem("g_b_mega") === "true";

const button = document.getElementById("btn");
const textElement = document.getElementById("text");
const cardElement = document.getElementById("card");
const rankNameElement = document.getElementById("rank-name");
const xpFillElement = document.getElementById("xp-fill");
const clicksLeftElement = document.getElementById("clicks-left");
const autoStatus = document.getElementById("auto-status");
const tokensDisplay = document.getElementById("crit-tokens-count");

// Кнопки магазина и сброса
const buyClickBtn = document.getElementById("buy-click-btn");
const buyAutoBtn = document.getElementById("buy-auto-btn");
const buyLuckBtn = document.getElementById("buy-luck-btn");
const buyMegaBtn = document.getElementById("buy-mega-btn");
const resetBtn = document.getElementById("reset-btn");

let autoClickInterval = null;

function saveGame() {
  localStorage.setItem("g_xp", xp);
  localStorage.setItem("g_level", currentLevel);
  localStorage.setItem("g_needed", clicksNeeded);
  localStorage.setItem("g_tokens", critTokens);
  localStorage.setItem("g_b_click", hasClickUpgrade);
  localStorage.setItem("g_b_auto", hasAutoUpgrade);
  localStorage.setItem("g_b_luck", hasLuckUpgrade);
  localStorage.setItem("g_b_mega", hasMegaUpgrade);
}

function updateAutoClicker() {
  if (autoClickInterval) clearInterval(autoClickInterval);

  if (currentLevel >= 30) {
    autoStatus.style.display = "block";
    autoStatus.textContent = "🌌 Сингулярность: +100 XP/сек";
    autoClickInterval = setInterval(() => {
      xp += 100;
      checkLevelUp();
      saveGame();
    }, 1000);
    return;
  }

  if (currentLevel >= 2) {
    autoStatus.style.display = "block";

    let passiveXp = 1;
    if (hasAutoUpgrade) passiveXp += 4;
    if (hasMegaUpgrade) passiveXp += 24;

    autoStatus.textContent = `🤖 Пассивный ИИ-доход: +${passiveXp} XP/сек`;

    autoClickInterval = setInterval(() => {
      xp += passiveXp;
      checkLevelUp();
      saveGame();
    }, 1000);
  } else {
    autoStatus.style.display = "none";
  }
}

function updateShopUI() {
  tokensDisplay.textContent = critTokens;

  // 1. Апгрейд Клика
  if (hasClickUpgrade) {
    buyClickBtn.textContent = "АКТИВНО";
    buyClickBtn.disabled = true;
  } else {
    buyClickBtn.textContent = "Купить (3 ✨)";
    buyClickBtn.disabled = critTokens < 3;
  }

  // 2. Апгрейд Автокликера
  if (hasAutoUpgrade) {
    buyAutoBtn.textContent = "АКТИВНО";
    buyAutoBtn.disabled = true;
  } else {
    buyAutoBtn.textContent = "Купить (5 ✨)";
    buyAutoBtn.disabled = critTokens < 5;
  }

  // 3. Апгрейд Удачи
  if (hasLuckUpgrade) {
    buyLuckBtn.textContent = "АКТИВНО";
    buyLuckBtn.disabled = true;
  } else {
    buyLuckBtn.textContent = "Купить (8 ✨)";
    buyLuckBtn.disabled = critTokens < 8;
  }

  // 4. Мега-Апгрейд ИИ
  if (hasMegaUpgrade) {
    buyMegaBtn.textContent = "АКТИВНО";
    buyMegaBtn.disabled = true;
  } else {
    buyMegaBtn.textContent = "Купить (15 ✨)";
    buyMegaBtn.disabled = critTokens < 15;
  }
}

function checkLevelUp() {
  if (currentLevel >= 30) {
    rankNameElement.textContent = getRankName(currentLevel);
    xpFillElement.style.width = "100%";
    clicksLeftElement.textContent = "МАКС";
    button.textContent = "ТЫ СТАЛ БОГОМ СЕТИ!";
    button.disabled = true;
    return;
  }

  if (xp >= clicksNeeded) {
    xp = xp - clicksNeeded;
    currentLevel++;
    clicksNeeded = clicksNeeded + 6;

    updateAutoClicker();

    if (currentLevel === 30) {
      alert(`🏆 СВЕРШИЛОСЬ! Ты покорил 30 уровень и вошел в вечность!`);
    } else {
      alert(`🎉 Ранг повышен! Твой статус: ${getRankName(currentLevel)}`);
    }
  }

  rankNameElement.textContent = getRankName(currentLevel);
  if (currentLevel < 30) {
    xpFillElement.style.width = (xp / clicksNeeded) * 100 + "%";
    clicksLeftElement.textContent = Math.max(0, clicksNeeded - xp);
  }
}

// Обработчики кнопок магазина
buyClickBtn.addEventListener("click", () => {
  if (critTokens >= 3 && !hasClickUpgrade) {
    critTokens -= 3;
    hasClickUpgrade = true;
    saveGame();
    updateShopUI();
    updateButtonText(0);
  }
});

buyAutoBtn.addEventListener("click", () => {
  if (critTokens >= 5 && !hasAutoUpgrade) {
    critTokens -= 5;
    hasAutoUpgrade = true;
    saveGame();
    updateShopUI();
    updateAutoClicker();
  }
});

buyLuckBtn.addEventListener("click", () => {
  if (critTokens >= 8 && !hasLuckUpgrade) {
    critTokens -= 8;
    hasLuckUpgrade = true;
    saveGame();
    updateShopUI();
  }
});

buyMegaBtn.addEventListener("click", () => {
  if (critTokens >= 15 && !hasMegaUpgrade) {
    critTokens -= 15;
    hasMegaUpgrade = true;
    saveGame();
    updateShopUI();
    updateAutoClicker();
  }
});

// 🔥 НАДЁЖНАЯ ЛОГИКА ПОЛНОГО СБРОСА ПРОГРЕССА
resetBtn.addEventListener("click", () => {
  if (
    confirm(
      "Ты точно хочешь СБРОСИТЬ ВЕСЬ ПРОГРЕСС? Уровень, жетоны и все купленные бусты исчезнут навсегда!",
    )
  ) {
    // 1. Полностью стираем хранилище браузера
    localStorage.clear();
    [1];

    // 2. Останавливаем таймер автокликера, чтобы он перестал капать на фоне
    if (autoClickInterval) clearInterval(autoClickInterval);

    // 3. Возвращаем все переменные кода в начальное состояние
    xp = 0;
    currentLevel = 1;
    clicksNeeded = 5;
    critTokens = 0;
    hasClickUpgrade = false;
    hasAutoUpgrade = false;
    hasLuckUpgrade = false;
    hasMegaUpgrade = false;

    // 4. Разблокируем главную кнопку клика на случай, если был 30 уровень
    button.disabled = false;

    // 5. Перезагружаем страницу, чтобы игра началась абсолютно заново с чистого листа
    location.reload();
  }
});

function updateButtonText(isCrit) {
  if (currentLevel >= 30) return;
  let normalGive = hasClickUpgrade ? 10 : 1;
  let Math_critGive = hasClickUpgrade ? 30 : 5;
  button.textContent = isCrit
    ? `Написать код (+${Math_critGive} XP)`
    : `Написать код (+${normalGive} XP)`;
}

// Инициализация игры при старте
checkLevelUp();
updateAutoClicker();
updateShopUI();
updateButtonText(0);
// Важно: принудительно делаем кнопку сброса всегда активной, чтобы на неё не влияли стили магазина!
resetBtn.disabled = false;

button.addEventListener("click", function () {
  if (currentLevel >= 30) return;

  const critLimit = hasLuckUpgrade ? 40 : 20;
  const chance = Math.floor(Math.random() * 100);

  cardElement.classList.remove("epic-appearance");
  const oldSecret = document.getElementById("secret-content");
  if (oldSecret) {
    oldSecret.remove();
  }
  textElement.style.display = "block";

  if (chance < critLimit) {
    let critGive = hasClickUpgrade ? 30 : 5;
    xp += critGive;
    critTokens += 1;

    cardElement.style.backgroundColor = "rgba(45, 52, 54, 0.96)";
    textElement.style.display = "none";

    setTimeout(() => {
      cardElement.classList.add("epic-appearance");
    }, 10);

    const secretContainer = document.createElement("div");
    secretContainer.id = "secret-content";
    secretContainer.className = "fade-up-text";

    secretContainer.innerHTML = `
            <h3 style="color: #00cec9; margin-top: 0; font-size: 20px;">✨ КРИТ УДАЧА ✨</h3>
            <p style="color: #55efc4; font-weight: bold; margin: 2px 0;">БОНУС: +${critGive} XP! 🚀</p>
            <p style="color: #e73c7e; font-size: 11px; margin: 2px 0;">+1 Крит-жетон получен!</p>
            <img src="https://postimg.cc" alt="Мем" style="width: 100%; max-width: 140px; border-radius: 10px; margin-bottom: 5px;">
        `;

    cardElement.insertBefore(secretContainer, button);
    updateButtonText(1);
  } else {
    let normalGive = hasClickUpgrade ? 10 : 1;
    xp += normalGive;

    const randomPredictionIndex = Math.floor(
      Math.random() * predictions.length,
    );
    const randomColorIndex = Math.floor(Math.random() * colors.length);

    textElement.textContent = predictions[randomPredictionIndex];
    cardElement.style.backgroundColor = colors[randomColorIndex];
    updateButtonText(0);
  }

  checkLevelUp();
  updateShopUI();
  saveGame();
});
