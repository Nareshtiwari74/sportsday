let scores = { red: 0, blue: 0, green: 0, yellow: 0 };
const colors = Object.keys(scores);

const teamColors = { red: "#c84a3e", blue: "#3877b9", green: "#26724b", yellow: "#e9ad32" };

function log(message) {
  const line = document.createElement("div");
  line.className = "log-line";
  line.textContent = message;
  document.getElementById("consoleLog").appendChild(line);
  console.log(message);
}

function setEvent(title, message) {
  document.getElementById("eventTitle").textContent = title;
  document.getElementById("eventMessage").textContent = message;
}

function renderScores() {
  const maximum = Math.max(...Object.values(scores), 1);
  document.getElementById("scores").innerHTML = colors.map((color) => `
    <div class="score-row">
      <span class="team-swatch" style="background:${teamColors[color]}"></span>
      <span class="team-name">${color[0].toUpperCase() + color.slice(1)} Team</span>
      <strong class="team-score">${scores[color]}</strong>
      <span class="score-track"><span class="score-fill" style="width:${scores[color] / maximum * 100}%;background:${teamColors[color]}"></span></span>
    </div>
  `).join("");
}

function OpeningCeremony(callback) {
  scores = { red: 0, blue: 0, green: 0, yellow: 0 };
  document.getElementById("consoleLog").replaceChildren();
  document.getElementById("eventNumber").textContent = "0 / 3 events";
  document.getElementById("statusText").textContent = "Opening ceremony in progress";
  setEvent("Opening Ceremony", "The teams enter the field and the Sports Day begins.");
  log("Opening Ceremony: Sports Day has started.");
  renderScores();

  const interval = setInterval(() => log("The Sports Day is starting..."), 1000);
  setTimeout(() => {
    clearInterval(interval);
    callback(scores);
  }, 3000);
}

function Race100M(callback, currentScores) {
  setTimeout(() => {
    const times = {};
    colors.forEach((color) => {
      times[color] = (10 + Math.random() * 3).toFixed(2);
    });

    const winner = colors.reduce((fastest, color) =>
      Number(times[color]) < Number(times[fastest]) ? color : fastest
    );

    console.log("Race times:", times);
    log(`Previous score for ${winner}: ${currentScores[winner]}`);
    currentScores[winner] += 50;
    log(`Updated score for ${winner}: ${currentScores[winner]}`);
    document.getElementById("eventNumber").textContent = "1 / 3 events";
    document.getElementById("statusText").textContent = "100 metre race complete";
    setEvent(`${winner[0].toUpperCase() + winner.slice(1)} wins the 100m`, `${times[winner]} seconds`);
    renderScores();

    callback(currentScores);
  }, 3000);
}

function LongJump(callback, currentScores) {
  setTimeout(() => {
    const winner = colors[Math.floor(Math.random() * colors.length)];
    const points = Math.floor(Math.random() * 10 + 1) * 10;

    console.log(`Long Jump selected team: ${winner}`);
    log(`Previous score for ${winner}: ${currentScores[winner]}`);
    currentScores[winner] += points;
    log(`Updated score for ${winner}: ${currentScores[winner]}`);
    document.getElementById("eventNumber").textContent = "2 / 3 events";
    document.getElementById("statusText").textContent = "Long jump complete";
    setEvent(`${winner[0].toUpperCase() + winner.slice(1)} wins the long jump`, `${points} points awarded`);
    renderScores();

    callback(currentScores);
  }, 2000);
}

function HighJump(callback, currentScores) {
  let answer = prompt("Which color cleared the highest jump? (red, blue, green, yellow)");
  answer = answer ? answer.trim().toLowerCase() : "";

  const winner = colors[Math.floor(Math.random() * colors.length)];

  if (answer === winner) {
    console.log(`Previous score for ${winner}: ${currentScores[winner]}`);
    currentScores[winner] += 30;
    console.log(`Correct! Updated score for ${winner}: ${currentScores[winner]}`);
  } else if (answer === "") {
    console.log("No color was entered.");
  } else if (!colors.includes(answer)) {
    console.log("Invalid color.");
  } else {
    console.log(`Incorrect. ${winner} cleared the highest jump.`);
  }

  document.getElementById("eventNumber").textContent = "3 / 3 events";
  document.getElementById("statusText").textContent = "High jump complete";
  setEvent(`${winner[0].toUpperCase() + winner.slice(1)} wins the high jump`, "High Jump results are complete");
  renderScores();
  callback(currentScores);
}

function AwardCeremony(currentScores) {
  console.log("Final scores:", currentScores);

  const highestScore = Math.max(...Object.values(currentScores));
  const winners = colors.filter((color) => currentScores[color] === highestScore);

  if (winners.length === 1) {
    console.log(`${winners[0]} wins with ${highestScore} points!`);
  } else {
    console.log(`${winners.join(" and ")} share first place with ${highestScore} points!`);
  }

  document.getElementById("statusText").textContent = "Meet complete";
  setEvent(`${winners.join(" and ")} wins!`, `${highestScore} points`);
}

function startSportsDay() {
  OpeningCeremony((openingScores) => {
    Race100M((raceScores) => {
      LongJump((longJumpScores) => {
        HighJump(AwardCeremony, longJumpScores);
      }, raceScores);
    }, openingScores);
  });
}

window.startSportsDay = startSportsDay;
document.getElementById("startButton").addEventListener("click", startSportsDay);
document.getElementById("clearLogButton").addEventListener("click", () => {
  document.getElementById("consoleLog").replaceChildren();
});
renderScores();