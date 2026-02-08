let socket;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 3000;
// Keep XP data in one place so runtime calculations reuse the same source.
// Source: The Arreat Summit / classic.battle.net XP per level table.
const XP_TABLE = {
  1: [0, 500],
  2: [500, 1000],
  3: [1500, 2250],
  4: [3750, 4125],
  5: [7875, 6300],
  6: [14175, 8505],
  7: [22680, 10206],
  8: [32886, 11510],
  9: [44396, 13319],
  10: [57715, 14429],
  11: [72144, 18036],
  12: [90180, 22545],
  13: [112725, 28181],
  14: [140906, 35226],
  15: [176132, 44033],
  16: [220165, 55042],
  17: [275207, 68801],
  18: [344008, 86002],
  19: [430010, 107503],
  20: [537513, 134378],
  21: [671891, 167973],
  22: [839864, 209966],
  23: [1049830, 262457],
  24: [1312287, 328072],
  25: [1640359, 410090],
  26: [2050449, 512612],
  27: [2563061, 640765],
  28: [3203826, 698434],
  29: [3902260, 761293],
  30: [4663553, 829810],
  31: [5493363, 904492],
  32: [6397855, 985897],
  33: [7383752, 1074627],
  34: [8458379, 1171344],
  35: [9629723, 1276765],
  36: [10906488, 1391674],
  37: [12298162, 1516924],
  38: [13815086, 1653448],
  39: [15468534, 1802257],
  40: [17270791, 1964461],
  41: [19235252, 2141263],
  42: [21376515, 2333976],
  43: [23710491, 2544034],
  44: [26254525, 2772997],
  45: [29027522, 3022566],
  46: [32050088, 3294598],
  47: [35344686, 3591112],
  48: [38935798, 3914311],
  49: [42850109, 4266600],
  50: [47116709, 4650593],
  51: [51767302, 5069147],
  52: [56836449, 5525370],
  53: [62361819, 6022654],
  54: [68384473, 6564692],
  55: [74949165, 7155515],
  56: [82104680, 7799511],
  57: [89904191, 8501467],
  58: [98405658, 9266598],
  59: [107672256, 10100593],
  60: [117772849, 11009646],
  61: [128782495, 12000515],
  62: [140783010, 13080560],
  63: [153863570, 14257811],
  64: [168121381, 15541015],
  65: [183662396, 16939705],
  66: [200602101, 18464279],
  67: [219066380, 20126064],
  68: [239192444, 21937409],
  69: [261129853, 23911777],
  70: [285041630, 26063836],
  71: [311105466, 28409582],
  72: [339515048, 30966444],
  73: [370481492, 33753424],
  74: [404234916, 36791232],
  75: [441026148, 40102443],
  76: [481128591, 43711663],
  77: [524840254, 47645713],
  78: [572485967, 51933826],
  79: [624419793, 56607872],
  80: [681027665, 61702579],
  81: [742730244, 67255812],
  82: [809986056, 73308835],
  83: [883294891, 79906630],
  84: [963201521, 87098226],
  85: [1050299747, 94937067],
  86: [1145236814, 103481403],
  87: [1248718217, 112794729],
  88: [1361512946, 122946255],
  89: [1484459201, 134011418],
  90: [1618470619, 146072446],
  91: [1764543065, 159218965],
  92: [1923762030, 173548673],
  93: [2097310703, 189168053],
  94: [2286478756, 206193177],
  95: [2492671933, 224750564],
  96: [2717422497, 244978115],
  97: [2962400612, 267026144],
  98: [3229426756, 291058498],
  99: [3520485254, 0],
};

// Source: The Arreat Summit "Experience" table (Character Levels 70-98).
const XP_LEVEL_PENALTY_BY_LEVEL = {
  70: 0.9531,
  71: 0.9063,
  72: 0.8594,
  73: 0.8125,
  74: 0.7656,
  75: 0.7188,
  76: 0.6719,
  77: 0.625,
  78: 0.5781,
  79: 0.5313,
  80: 0.4844,
  81: 0.4375,
  82: 0.3906,
  83: 0.3438,
  84: 0.2969,
  85: 0.25,
  86: 0.1875,
  87: 0.1406,
  88: 0.1094,
  89: 0.0859,
  90: 0.0596,
  91: 0.0449,
  92: 0.0342,
  93: 0.0254,
  94: 0.0195,
  95: 0.0146,
  96: 0.0107,
  97: 0.0078,
  98: 0.0059,
};

function connectWebSocket() {
  const wsScheme = window.location.protocol === "https:" ? "wss://" : "ws://";
  socket = new WebSocket(wsScheme + window.location.host + "/ws");

  socket.onopen = function () {
    console.log("WebSocket connected");
    reconnectAttempts = 0;
  };

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    updateDashboard(data);
  };

  socket.onclose = function () {
    console.log("WebSocket disconnected");
    if (reconnectAttempts < maxReconnectAttempts) {
      setTimeout(connectWebSocket, reconnectDelay);
      reconnectAttempts++;
    } else {
      console.error("Max reconnect attempts reached");
    }
  };
}

function fetchInitialData() {
  fetch("/initial-data")
    .then((response) => response.json())
    .then((data) => {
      updateDashboard(data);
      document.getElementById("loading").style.display = "none";
      document.getElementById("dashboard").style.display = "block";

      // Show auto-start confirmation prompt once on initial load
      maybeShowAutoStartPrompt(data);
    })
    .catch((error) => console.error("Error fetching initial data:", error));
}

function updateDashboard(data) {
  const versionElement = document.getElementById("version");
  if (versionElement) {
    versionElement.textContent = data.Version;
    if (data.Version === "dev") {
      versionElement.textContent = "Development Version";
      versionElement.style.backgroundColor = "#dc3545";
    }
  }

  const container = document.getElementById("characters-container");
  if (!container) return;

  if (Object.keys(data.Status).length === 0) {
    container.innerHTML =
      "<article><p>No characters found, start adding a new character.</p></article>";
    return;
  }

  for (const [key, value] of Object.entries(data.Status)) {
    let card = document.getElementById(`card-${key}`);
    if (!card) {
      card = createCharacterCard(key);
      container.appendChild(card);
    }
    const schedulerInfo = data.schedulerStatus ? data.schedulerStatus[key] : null;
    updateCharacterCard(card, key, value, data.DropCount[key], schedulerInfo);

    // Sync Auto Start toggle if present
    const autoStartCheckbox = card.querySelector(".autostart-checkbox");
    if (autoStartCheckbox && data.AutoStart) {
      autoStartCheckbox.checked = !!data.AutoStart[key];
    }
  }

  // Remove cards for characters that no longer exist
  Array.from(container.children).forEach((card) => {
    if (!data.Status.hasOwnProperty(card.id.replace("card-", ""))) {
      container.removeChild(card);
    }
  });
}

function createCharacterCard(key) {
  const card = document.createElement("div");
  card.className = "character-card";
  card.id = `card-${key}`;
  const supervisorName = key && String(key).trim() !== "" ? key : "Supervisor";

  // Keep compact stat buttons readable while still showing a tooltip label on hover.
  card.innerHTML = `
            <div class="character-header">
                <div class="character-stats">
                  <div class="character-info">
                    <label class="autostart-toggle" title="Include in Auto Start">
                      <input type="checkbox" class="autostart-checkbox" data-character="${key}">
                    </label>
                    <span class="supervisor-name">${supervisorName}</span>
                    <div class="status-indicator"></div>
                    <span class="co-char-meta">Char name | Char class</span>
                  </div>
                </div>
                <div class="character-controls">
                      <div class="character-controls-row character-controls-row-main">
                          <button class="start-pause btn btn-start" data-character="${key}" title="Start">
                              <i class="bi bi-play-fill"></i>
                          </button>
                          <button class="manual-play btn btn-manual" data-character="${key}" title="Manual Play" style="display:none;">
                              M
                          </button>
                          <button class="btn btn-outline attach-btn" onclick="showAttachPopup('${key}')" style="display:none;" title="Attach">
                              <i class="bi bi-link-45deg"></i>
                          </button>
                          <button class="stop btn btn-stop" data-character="${key}" style="display:none;" title="Stop">
                              <i class="bi bi-stop-fill"></i>
                          </button>
                          <button class="btn btn-outline settings-btn" onclick="location.href='/supervisorSettings?supervisor=${key}'" title="Settings">
                              <i class="bi bi-gear"></i>
                          </button>
                          <button class="btn btn-outline reset-muling-btn" data-character-name="${key}" title="Reset Muling Progress">
                              <i class="bi bi-arrow-counterclockwise"></i>
                          </button>
                          <button class="btn btn-outline armory-btn" onclick="location.href='/armory?character=${key}'" title="Armory">
                              <i class="bi bi-shield-shaded"></i>
                          </button>
                          <button class="btn btn-outline dump-inventory-btn" title="Update Armory now" aria-label="Update Character in Armory">
                              <i class="bi bi-person-plus"></i>
                          </button>
                          <button class="btn btn-outline btn-inline-stat btn-games" title="Games" aria-label="Games">
                              <i class="bi bi-controller btn-icon"></i><span class="games-count">0</span>
                          </button>
                          <button class="btn btn-outline btn-inline-stat btn-drops" title="Drops" aria-label="Drops">
                              <i class="bi bi-gem btn-icon"></i><span class="drops-count">0</span>
                          </button>
                          <button class="toggle-details" title="Toggle Details">
                              <i class="bi bi-chevron-down"></i>
                          </button>
                          <button class="btn btn-outline companion-join-btn" onclick="showCompanionJoinPopup('${key}')" style="display:none;">
                              <i class="bi bi-door-open btn-icon"></i>Join Game
                          </button>
                      </div>
                  </div>
            </div>
            <div class="character-overview-lines">
              <div class="co-line co-line-with-stats">
                <div class="co-info-left">
                  <span class="co-difficulty">Difficulty</span>
                  <span class="co-dot"> • </span>
                  <span class="co-area">Area</span>
                  <span class="co-dot"> • </span>
                  <span class="co-ping">Ping: —</span>
                  <span class="co-dot"> • </span>
                  <span class="co-level">Lvl: —</span>
                  <div class="co-xp" title="">
                      <div class="xp-bar" style="height:12px;background:#2b2f36;border-radius:4px;overflow:hidden;width:75px;display:inline-block;vertical-align:middle;">
                          <div class="xp-bar-fill" style="height:100%;width:0;background:linear-gradient(90deg,#6aa0ff,#3a7bff);"></div>
                      </div>
                      <span class="xp-percent">0%</span>
                  </div>
                  <span class="co-eta-wrap">
                    <span class="co-dot"> • </span>
                    <span class="co-eta">Lvl up in ~ —</span>
                  </span>
                  <span class="co-dot"> • </span>
                  <span class="co-games-per-hour-inline">Games/h: —</span>
                </div>
              </div>
              <div class="co-line co-vitals-line">
                <span class="co-life">Life: -</span>
                <span class="co-dot"> • </span>
                <span class="co-mana">Mana: -</span>
                <span class="co-dot"> • </span>
                <span class="co-mf">MF: -</span>
                <span class="co-dot"> • </span>
                <span class="co-gold">Gold: -</span>
                <span class="co-dot"> • </span>
                <span class="co-gf">GF: -</span>
                <span class="co-dot"> • </span>
                <span class="co-res">Res: -</span>
              </div>
            </div>
            <div class="character-details">
                <div class="co-line expanded-runtime-line">
                    <span class="runtime-entry">
                      <span class="runtime-label">Supervisor running for: </span><span class="running-for">—</span>
                    </span>
                    <span class="co-dot"> • </span>
                    <span class="runtime-entry">
                      <span class="runtime-label">Current game: </span><span class="current-game-time">—</span>
                    </span>
                    <span class="co-dot"> • </span>
                    <span class="runtime-entry">
                      <span class="runtime-label">avg game: </span><span class="avg-game-time">—</span>
                    </span>
                    <span class="co-dot"> • </span>
                    <span class="runtime-entry runtime-entry-to99">
                      <span class="runtime-label">Runs to Lvl 99: ~ </span><span class="to-level-99">—</span>
                    </span>
                </div>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-label">Chickens</div>
                        <div class="stat-value chickens">0</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Deaths</div>
                        <div class="stat-value deaths">0</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Errors</div>
                        <div class="stat-value errors">0</div>
                    </div>
                </div>
                <div class="scheduler-status" style="display:none;">
                    <div class="scheduler-phase"></div>
                    <div class="scheduler-info"></div>
                    <div class="scheduler-next"></div>
                </div>
                <div class="expanded-controls">
                    <button class="btn btn-outline" onclick="location.href='/debug?characterName=${key}'" title="Open Debug Page">
                        <i class="bi bi-bug"></i>
                    </button>
                </div>
                <div class="run-stats"></div>
            </div>
        `;

  setupEventListeners(card, key);
  return card;
}

function setupEventListeners(card, key) {
  if (!card) return;

  const toggleDetailsBtn = card.querySelector(".toggle-details");
  const startPauseBtn = card.querySelector(".start-pause");
  const stopBtn = card.querySelector(".stop");
  const resetMuleBtn = card.querySelector(".reset-muling-btn");
  const dumpInventoryBtn = card.querySelector(".dump-inventory-btn");
  const autoStartCheckbox = card.querySelector(".autostart-checkbox");
  if (resetMuleBtn) {
    resetMuleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (
        confirm(
          `Are you sure you want to reset the muling progress for ${key}? This should only be done if you have manually emptied the mules.`
        )
      ) {
        fetch("/reset-muling?characterName=" + key, {
          method: "POST",
        }).then((response) => {
          if (response.ok) {
            alert("Muling progress for " + key + " has been reset.");
          } else {
            alert("Failed to reset muling progress.");
          }
        });
      }
    });
  }

  if (toggleDetailsBtn) {
    toggleDetailsBtn.addEventListener("click", function () {
      card.classList.toggle("expanded");
      this.querySelector("i").style.transform = card.classList.contains(
        "expanded"
      )
        ? "rotate(180deg)"
        : "rotate(0deg)";
      saveExpandedState();
    });
  }

  if (autoStartCheckbox) {
    autoStartCheckbox.addEventListener("change", (e) => {
      e.stopPropagation();
      const enabled = autoStartCheckbox.checked;
      fetch(
        `/autostart/toggle?characterName=${encodeURIComponent(
          key
        )}&enabled=${enabled}`,
        {
          method: "POST",
        }
      ).catch((err) => {
        console.error("Failed to toggle auto start", err);
      });
    });
  }

  if (dumpInventoryBtn) {
    // Trigger a manual armory dump and save current inventory to JSON.
    dumpInventoryBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      try {
        const response = await fetch(
          `/api/armory/dump?characterName=${encodeURIComponent(key)}`,
          {
            method: "POST",
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to export inventory");
        }
      } catch (error) {
        console.error("Failed to export inventory:", error);
      }
    });
  }

  if (startPauseBtn) {
    startPauseBtn.addEventListener("click", function () {
      const currentStatus = this.className.includes("btn-start")
        ? "Not Started"
        : this.className.includes("btn-pause")
          ? "In game"
          : "Paused";
      let action;
      if (currentStatus === "Not Started") {
        action = "start";
      } else if (currentStatus === "In game") {
        action = "togglePause";
      } else {
        // Paused
        action = "togglePause";
      }
      fetch(`/${action}?characterName=${key}`)
        .then((response) => response.json())
        .then((data) => {
          updateDashboard(data);
        })
        .catch((error) => console.error("Error:", error));
    });
  }
  if (stopBtn) {
    stopBtn.addEventListener("click", function () {
      fetch(`/stop?characterName=${key}`).then(() => fetchInitialData());
    });
  }

  const manualPlayBtn = card.querySelector(".manual-play");
  if (manualPlayBtn) {
    manualPlayBtn.addEventListener("click", function () {
      // Don't trigger if already running (yellow state)
      if (this.className.includes("btn-pause")) {
        return;
      }
      fetch(`/start?characterName=${key}&manualMode=true`)
        .then((response) => response.json())
        .then((data) => updateDashboard(data))
        .catch((error) => console.error("Error:", error));
    });
  }
}

function updateStatusPosition(card, isExpanded) {
  if (!card) return;

  const statusBadge = card.querySelector(".status-badge");
  const headerStatusContainer = card.querySelector(".character-name-status");
  const detailsStatusContainer = card.querySelector(".status-details");

  if (!statusBadge || !headerStatusContainer || !detailsStatusContainer) return;

  if (isExpanded) {
    detailsStatusContainer.insertBefore(
      statusBadge,
      detailsStatusContainer.firstChild
    );
  } else {
    headerStatusContainer.appendChild(statusBadge);
  }
}

function updateCharacterCard(card, key, value, dropCount, schedulerInfo) {
  if (!card) return;
  const supervisorNameEl = card.querySelector(".supervisor-name");
  if (supervisorNameEl) {
    // Keep a readable placeholder until a real supervisor name is available.
    const supervisorName = key && String(key).trim() !== "" ? key : "Supervisor";
    supervisorNameEl.textContent = supervisorName;
  }

  const startPauseBtn = card.querySelector(".start-pause");
  const stopBtn = card.querySelector(".stop");
  const attachBtn = card.querySelector(".attach-btn");
  const manualPlayBtn = card.querySelector(".manual-play");
  const companionJoinBtn = card.querySelector(".companion-join-btn");
  const statusIndicator = card.querySelector(".status-indicator");
  const schedulerStatusDiv = card.querySelector(".scheduler-status");

  if (statusIndicator) {
    updateStatusIndicator(statusIndicator, value.SupervisorStatus);
  }

  if (startPauseBtn && stopBtn && attachBtn && manualPlayBtn) {
    updateButtons(startPauseBtn, stopBtn, attachBtn, manualPlayBtn, value.SupervisorStatus, value.manualModeActive);
  }

  // Update companion join button visibility
  if (companionJoinBtn) {
    const isCompanionFollower = value.IsCompanionFollower || false;
    // Only show the button if it's a companion follower AND the supervisor is running
    const isRunning =
      value.SupervisorStatus === "In game" ||
      value.SupervisorStatus === "Paused" ||
      value.SupervisorStatus === "Starting";
    companionJoinBtn.style.display =
      isCompanionFollower && isRunning ? "inline-flex" : "none";
  }

  updateStats(card, key, value.Games, dropCount);
  updateRunStats(card, value.Games);

  // Enrich with live character overview (support both UI and ui keys)
  const uiPayload = value.UI || value.ui || null;
  updateCharacterOverview(card, uiPayload, value.SupervisorStatus, value.Games);

  updateStartedTime(card, value.StartedAt, value.Games);

  // Update scheduler status
  if (schedulerStatusDiv) {
    updateSchedulerStatus(schedulerStatusDiv, schedulerInfo);
  }
}

// Format time remaining as "Xh Ym" or "Ym"
function formatCountdown(targetTimeStr) {
  if (!targetTimeStr) return "";
  const diff = new Date(targetTimeStr) - new Date();
  if (diff <= 0) return "now";
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

// Format time as "HH:MM"
function formatTime(timeStr) {
  if (!timeStr) return "-";
  const d = new Date(timeStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function updateSchedulerStatus(container, info) {
  if (!info || !info.enabled || info.mode !== "duration") {
    container.style.display = "none";
    return;
  }

  container.style.display = "block";

  const phaseDiv = container.querySelector(".scheduler-phase");
  const infoDiv = container.querySelector(".scheduler-info");
  const nextDiv = container.querySelector(".scheduler-next");

  // Phase badge
  const phaseClass = info.phase === "playing" ? "phase-playing" :
    info.phase === "onBreak" ? "phase-break" : "phase-resting";
  const phaseText = info.phase === "playing" ? "PLAYING" :
    info.phase === "onBreak" ? "ON BREAK" : "RESTING";
  phaseDiv.innerHTML = `<span class="scheduler-phase-badge ${phaseClass}">${phaseText}</span>`;

  // Info line
  if (info.phase === "playing") {
    const playedHours = Math.floor(info.playedMinutes / 60);
    const playedMins = info.playedMinutes % 60;
    const playedStr = playedHours > 0 ? `${playedHours}h ${playedMins}m` : `${playedMins}m`;
    infoDiv.innerHTML = `<span>Started: ${formatTime(info.phaseStartTime)}</span> • <span>Played: ${playedStr}</span>`;
  } else if (info.phase === "onBreak") {
    infoDiv.innerHTML = `<span>Break until: ${formatTime(info.phaseEndTime)}</span> (${formatCountdown(info.phaseEndTime)})`;
  } else {
    infoDiv.innerHTML = `<span>Resting until: ${formatTime(info.todayWakeTime)}</span> (${formatCountdown(info.todayWakeTime)})`;
  }

  // Next events
  let nextHtml = "";
  if (info.nextBreaks && info.nextBreaks.length > 0) {
    nextHtml = "<div class='scheduler-next-title'>Next:</div>";
    info.nextBreaks.slice(0, 3).forEach((brk, i) => {
      const label = brk.type === "meal" ? "Meal break" : "Short break";
      nextHtml += `<div class="scheduler-next-item">${label} at ${formatTime(brk.startTime)} (${brk.duration}min) - in ${formatCountdown(brk.startTime)}</div>`;
    });
  }
  if (info.todayRestTime && info.phase === "playing") {
    nextHtml += `<div class="scheduler-rest-time">Rest begins: ~${formatTime(info.todayRestTime)} (in ${formatCountdown(info.todayRestTime)})</div>`;
  }
  nextDiv.innerHTML = nextHtml;
}

function updateStatusIndicator(statusIndicator, status) {
  statusIndicator.classList.remove("in-game", "paused", "stopped");
  if (status === "In game") {
    statusIndicator.classList.add("in-game");
  } else if (status === "Starting") {
    statusIndicator.classList.add("paused");
  } else if (status === "Paused") {
    statusIndicator.classList.add("paused");
  } else {
    statusIndicator.classList.add("stopped");
  }
}

function updateStatus(statusBadge, statusDetails, status) {
  if (!statusBadge || !statusDetails) return;

  const statusText = status || "Not started";
  statusBadge.innerHTML = `<span class="status-label">Status:</span> <span class="status-value">${statusText}</span>`;
  statusBadge.className = `status-badge status-${statusText
    .toLowerCase()
    .replace(" ", "")}`;
}

function updateStartedTime(card, startedAt, games) {
  const runningForElement = card.querySelector(".running-for");
  const currentGameElement = card.querySelector(".current-game-time");
  const avgGameElement = card.querySelector(".avg-game-time");
  if (!runningForElement || !currentGameElement || !avgGameElement) return;

  const now = new Date();

  // Keep existing runtime behavior, but render it in the expanded runtime line.
  if (!startedAt || startedAt === "" || startedAt === "0001-01-01T00:00:00Z") {
    runningForElement.textContent = "—";
  } else {
    const startTime = new Date(startedAt);
    if (isNaN(startTime.getTime()) || startTime.getFullYear() < 2000 || now - startTime < 0) {
      runningForElement.textContent = "—";
    } else {
      // Show only the time units that are needed (s, m+s, h+m+s, d+h+m+s).
      runningForElement.textContent = formatDurationHMS(now - startTime);
    }
  }

  const gameTiming = getGameTimingStats(games);
  const currentGameStartedAt = gameTiming.currentGameStartedAt;

  if (!currentGameStartedAt) {
    currentGameElement.textContent = "—";
  } else {
    const currentGameStart = new Date(currentGameStartedAt);
    if (isNaN(currentGameStart.getTime()) || currentGameStart.getFullYear() < 2000 || now - currentGameStart < 0) {
      currentGameElement.textContent = "—";
    } else {
      currentGameElement.textContent = formatDurationHMS(now - currentGameStart);
    }
  }

  if (gameTiming.completedGames === 0 || gameTiming.completedTotalDuration <= 0) {
    avgGameElement.textContent = "—";
  } else {
    const avgGameDuration = gameTiming.completedTotalDuration / gameTiming.completedGames;
    avgGameElement.textContent = formatDurationHMS(avgGameDuration);
  }
}

// Collect reusable runtime values from game history for dashboard metrics.
function getGameTimingStats(games) {
  let currentGameStartedAt = null;
  let completedGames = 0;
  let completedTotalDuration = 0;

  if (!games || !Array.isArray(games) || games.length === 0) {
    return { currentGameStartedAt, completedGames, completedTotalDuration };
  }

  for (const game of games) {
    if (!game || !game.StartedAt || game.StartedAt === "0001-01-01T00:00:00Z") {
      continue;
    }

    const gameStart = new Date(game.StartedAt);
    if (isNaN(gameStart.getTime()) || gameStart.getFullYear() < 2000) {
      continue;
    }

    if (game.FinishedAt && game.FinishedAt !== "0001-01-01T00:00:00Z") {
      const gameEnd = new Date(game.FinishedAt);
      if (!isNaN(gameEnd.getTime()) && gameEnd >= gameStart) {
        completedGames++;
        completedTotalDuration += gameEnd - gameStart;
      }
    }
  }

  const latestGame = games[games.length - 1];
  if (
    latestGame &&
    latestGame.StartedAt &&
    latestGame.StartedAt !== "0001-01-01T00:00:00Z" &&
    (!latestGame.FinishedAt || latestGame.FinishedAt === "0001-01-01T00:00:00Z")
  ) {
    currentGameStartedAt = latestGame.StartedAt;
  }

  return { currentGameStartedAt, completedGames, completedTotalDuration };
}

function maybeShowAutoStartPrompt(data) {
  // Backend decides whether this prompt should be shown.
  // It will only be true on the first eligible dashboard load
  // after the program starts.
  if (!data.ShowAutoStartPrompt) return;

  // Additionally, guard on the frontend so that within a single
  // browser/webview session we only ever show this prompt once,
  // even if navigation/back-forward causes the dashboard to be
  // reloaded.
  try {
    if (sessionStorage.getItem("kooloAutoStartPromptShown") === "true") {
      return;
    }
    sessionStorage.setItem("kooloAutoStartPromptShown", "true");
  } catch (e) {
    // If sessionStorage is not available for any reason, we just
    // fall back to showing the prompt based solely on the backend
    // flag.
  }

  const overlay = document.createElement("div");
  overlay.id = "autostart-overlay";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,0.7)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "9999";

  const modal = document.createElement("div");
  modal.style.background = "#1f2430";
  modal.style.padding = "24px";
  modal.style.borderRadius = "12px";
  modal.style.maxWidth = "480px";
  modal.style.width = "100%";
  modal.style.boxShadow = "0 10px 40px rgba(0,0,0,0.6)";
  modal.style.color = "#fff";

  const title = document.createElement("h3");
  title.textContent = "Auto Start";

  const message = document.createElement("p");
  message.textContent =
    "Based on your settings, the selected characters will start automatically. If you don't want this, click Cancel.";

  const countdownText = document.createElement("p");
  countdownText.style.marginTop = "8px";

  const buttonRow = document.createElement("div");
  buttonRow.style.display = "flex";
  buttonRow.style.justifyContent = "flex-end";
  buttonRow.style.gap = "8px";
  buttonRow.style.marginTop = "16px";

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "btn btn-outline";
  cancelBtn.textContent = "Cancel";

  const confirmBtn = document.createElement("button");
  confirmBtn.className = "btn btn-start";
  confirmBtn.textContent = "Start Now";

  let remaining = 15;
  const updateCountdown = () => {
    countdownText.textContent = `Auto start will begin in ${remaining} seconds...`;
  };
  updateCountdown();

  const cleanup = () => {
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  };

  let timerId = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(timerId);
      triggerAutoStartOnce();
      cleanup();
    } else {
      updateCountdown();
    }
  }, 1000);

  cancelBtn.onclick = () => {
    clearInterval(timerId);
    cleanup();
  };

  confirmBtn.onclick = () => {
    clearInterval(timerId);
    triggerAutoStartOnce();
    cleanup();
  };

  buttonRow.appendChild(cancelBtn);
  buttonRow.appendChild(confirmBtn);

  modal.appendChild(title);
  modal.appendChild(message);
  modal.appendChild(countdownText);
  modal.appendChild(buttonRow);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function triggerAutoStartOnce() {
  fetch("/autostart/run-once", {
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text || "Failed to trigger auto start");
        });
      }
    })
    .catch((error) => {
      console.error("Error triggering auto start:", error);
      alert("Failed to trigger Auto Start: " + error.message);
    });
}

function updateButtons(startPauseBtn, stopBtn, attachBtn, manualPlayBtn, status, manualModeActive) {
  // Manual mode active - show yellow M button
  if (manualModeActive) {
    startPauseBtn.style.display = "none";
    manualPlayBtn.style.display = "flex";
    manualPlayBtn.className = "manual-play btn btn-pause"; // Yellow
    manualPlayBtn.title = "Manual Play";
    stopBtn.style.display = "flex";
    attachBtn.style.display = "none";
    return;
  }

  // Normal mode - reset manual button
  manualPlayBtn.style.display = "none";
  manualPlayBtn.className = "manual-play btn btn-manual"; // Darker green
  startPauseBtn.style.display = "flex";

  if (status === "Paused") {
    startPauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
    startPauseBtn.className = "start-pause btn btn-resume";
    startPauseBtn.title = "Resume";
    stopBtn.style.display = "flex";
    attachBtn.style.display = "none";
  } else if (status === "In game" || status === "Starting") {
    startPauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
    startPauseBtn.className = "start-pause btn btn-pause";
    startPauseBtn.title = "Pause";
    stopBtn.style.display = "flex";
    attachBtn.style.display = "none";
  } else {
    startPauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
    startPauseBtn.className = "start-pause btn btn-start";
    startPauseBtn.title = "Start";
    stopBtn.style.display = "none";
    attachBtn.style.display = "flex";
    manualPlayBtn.style.display = "flex"; // Show manual button when not running
    manualPlayBtn.title = "Manual Play";
  }
}

function updateStats(card, key, games, dropCount) {
  const stats = calculateStats(games);

  const runsEl = card.querySelector(".runs");
  const dropsEl = card.querySelector(".drops");
  const chickensEl = card.querySelector(".chickens");
  const deathsEl = card.querySelector(".deaths");
  const errorsEl = card.querySelector(".errors");

  if (runsEl) runsEl.textContent = stats.totalGames;
  if (dropsEl) {
    dropsEl.innerHTML =
      dropCount === undefined
        ? "None"
        : dropCount === 0
          ? "None"
          : `<a href="/drops?supervisor=${key}">${dropCount}</a>`;
  }
  if (chickensEl) chickensEl.textContent = stats.totalChickens;
  if (deathsEl) deathsEl.textContent = stats.totalDeaths;
  if (errorsEl) errorsEl.textContent = stats.totalErrors;

  // Update inline stats
  const gamesCountEl = card.querySelector(".games-count");
  const dropsCountEl = card.querySelector(".drops-count");
  const dropsBtn = card.querySelector(".btn-drops");

  if (gamesCountEl) gamesCountEl.textContent = stats.totalGames;
  if (dropsCountEl) dropsCountEl.textContent = dropCount === undefined ? 0 : dropCount;
  if (dropsBtn) {
    dropsBtn.onclick = (e) => {
      e.stopPropagation();
      window.location.href = `/drops?supervisor=${key}`;
    };
  }
}

function updateCharacterOverview(card, ui, status, games) {
  const charMetaEl = card.querySelector(".co-char-meta");
  const diffEl = card.querySelector(".co-difficulty");
  const areaEl = card.querySelector(".co-area");
  const pingEl = card.querySelector(".co-ping");
  const levelEl = card.querySelector(".co-level");
  const gamesPerHourInlineEl = card.querySelector(".co-games-per-hour-inline");
  const toLevel99El = card.querySelector(".to-level-99");
  const lifeEl = card.querySelector(".co-life");
  const manaEl = card.querySelector(".co-mana");
  const mfEl = card.querySelector(".co-mf");
  const gfEl = card.querySelector(".co-gf");
  const goldEl = card.querySelector(".co-gold");
  const resEl = card.querySelector(".co-res");
  const etaEl = card.querySelector(".co-eta");
  const etaWrapEl = card.querySelector(".co-eta-wrap");

  const cls = deriveClassName((ui && ui.Class) || "");
  const characterName = (ui && ui.CharacterName ? ui.CharacterName : "").trim();
  if (charMetaEl) {
    charMetaEl.textContent = `${characterName || "Char name"} | ${cls || "Char class"}`;
    charMetaEl.title = "";
  }

  // If not running, show placeholders
  const isActive =
    status === "In game" || status === "Paused" || status === "Starting";
  if (!ui || !isActive) {
    if (diffEl) diffEl.textContent = "Difficulty";
    if (areaEl) areaEl.textContent = "Area";
    if (pingEl) pingEl.textContent = "Ping: —";
    if (levelEl) levelEl.textContent = "Lvl: —";
    if (gamesPerHourInlineEl) gamesPerHourInlineEl.textContent = "Games/h: —";
    if (toLevel99El) toLevel99El.textContent = "—";
    if (lifeEl) lifeEl.textContent = "Life: —";
    if (manaEl) manaEl.textContent = "Mana: —";
    if (mfEl) mfEl.textContent = "MF: —";
    if (gfEl) gfEl.textContent = "GF: —";
    if (goldEl) goldEl.textContent = "Gold: —";
    if (resEl) resEl.textContent = "Res: —";
    if (etaEl) etaEl.textContent = "Lvl up in ~ —";
    if (etaWrapEl) etaWrapEl.style.display = "inline-flex";
    const xpFill = card.querySelector(".xp-bar-fill");
    const xpPct = card.querySelector(".xp-percent");
    if (xpFill) xpFill.style.width = "0%";
    if (xpPct) xpPct.textContent = "0%";
    return;
  }

  const lvl = ui.Level ?? 0;
  const exp = ui.Experience ?? 0;
  let lastExp = ui.LastExp ?? 0;
  let nextExp = ui.NextExp ?? 0;

  // Prefer static table if available or if NextExp looks invalid (0/negative)
  let gained = 0,
    needed = 1,
    toNext = 0,
    pct = 0,
    nextThreshold = 0;
  if (XP_TABLE[lvl]) {
    const [floor, toNextFromTable] = XP_TABLE[lvl];
    lastExp = floor;
    toNext = Math.max(0, toNextFromTable);
    nextThreshold = toNext > 0 ? floor + toNext : exp;
    gained = Math.max(0, exp - lastExp);
    needed = Math.max(1, toNext > 0 ? toNext : 1);
    pct = Math.max(0, Math.min(1, toNext > 0 ? gained / needed : 1));
  } else {
    // Fallback to dynamic stats when table entry not present
    // A) Thresholds: lastExp=start of level (abs), nextExp=next level threshold (abs)
    const thrGained = Math.max(0, exp - lastExp);
    const thrNeeded = Math.max(1, nextExp - lastExp);
    const thrToNext = Math.max(0, nextExp - exp);
    const thrPct = Math.max(0, Math.min(1, thrGained / thrNeeded));
    const thrValid = nextExp > lastExp && exp >= lastExp && exp <= nextExp;

    // B) Remaining: nextExp is remaining-to-next (delta)
    const remGained = Math.max(0, exp - lastExp);
    const remToNext = Math.max(0, nextExp);
    const remNeeded = Math.max(1, remGained + remToNext);
    const remPct = Math.max(0, Math.min(1, remGained / remNeeded));
    const remValid = remToNext >= 0;

    const isAtCap = lvl >= 99;
    if (!isAtCap) {
      const thrBelievable = thrValid && thrToNext > 0 && thrPct < 0.995;
      const remBelievable = remValid && remToNext > 0 && remPct < 0.995;
      if (thrBelievable || (!remBelievable && thrValid)) {
        gained = thrGained;
        needed = thrNeeded;
        toNext = thrToNext;
        pct = thrPct;
        nextThreshold = nextExp;
      } else if (remBelievable || (!thrBelievable && remValid)) {
        gained = remGained;
        needed = remNeeded;
        toNext = remToNext;
        pct = remPct;
        nextThreshold = exp + remToNext;
      } else {
        if (thrValid) {
          gained = thrGained;
          needed = thrNeeded;
          toNext = thrToNext;
          pct = thrPct;
          nextThreshold = nextExp;
        } else {
          gained = remGained;
          needed = remNeeded;
          toNext = remToNext;
          pct = remPct;
          nextThreshold = exp + remToNext;
        }
      }
    } else {
      gained = thrGained;
      needed = 1;
      toNext = 0;
      pct = 1;
      nextThreshold = exp;
    }
  }
  const diffRaw = titleCase(ui.Difficulty || "");
  const diff = ["Normal", "Nightmare", "Hell"].includes(diffRaw)
    ? diffRaw
    : "Difficulty";
  const areaRaw = ui.Area || "";
  const area = String(areaRaw) === "0" || String(areaRaw).trim() === "" ? "Area" : areaRaw;
  const ping = ui.Ping ?? 0;
  const life = ui.Life ?? 0;
  const maxLife = ui.MaxLife ?? 0;
  const mana = ui.Mana ?? 0;
  const maxMana = ui.MaxMana ?? 0;
  const mf = ui.MagicFind ?? 0;
  const gf = ui.GoldFind ?? 0;
  const gold = ui.Gold ?? 0;
  const fr = ui.FireResist ?? 0;
  const cr = ui.ColdResist ?? 0;
  const lr = ui.LightningResist ?? 0;
  const pr = ui.PoisonResist ?? 0;
  const pctText = isFinite(pct) ? `${(pct * 100).toFixed(1)}%` : "100%";
  const gameTiming = getGameTimingStats(games);

  // Estimate next level ETA from XP progress and average completed game time.
  let etaInlineText = "Lvl up in ~ —";
  if (lvl < 99 && toNext > 0) {
    if (gameTiming.completedGames > 0 && gameTiming.completedTotalDuration > 0 && gained > 0) {
      const avgGameDuration = gameTiming.completedTotalDuration / gameTiming.completedGames;
      const xpPerGame = gained / gameTiming.completedGames;
      if (isFinite(xpPerGame) && xpPerGame > 0) {
        const gamesToNext = toNext / xpPerGame;
        const etaMs = gamesToNext * avgGameDuration;
        if (isFinite(etaMs) && etaMs > 0) {
          etaInlineText = `Lvl up in ~ ${Math.ceil(gamesToNext)} games (${formatDurationHMS(etaMs)})`;
        }
      }
    }
  }

  if (charMetaEl) {
    charMetaEl.title = `XP: ${formatNumber(exp)} / Next: ${formatNumber(
      nextThreshold
    )} (Gained: ${formatNumber(gained)} | To Next: ${formatNumber(
      toNext
    )})\nRaw: LastExp=${formatNumber(lastExp)}, NextExp=${formatNumber(
      nextExp
    )}`;
  }
  const xpFill = card.querySelector(".xp-bar-fill");
  const xpPct = card.querySelector(".xp-percent");
  if (xpFill)
    xpFill.style.width = `${Math.max(0, Math.min(100, pct * 100)).toFixed(1)}%`;
  if (xpPct) xpPct.textContent = pctText;
  if (levelEl) levelEl.textContent = `Lvl: ${lvl}`;
  if (etaEl) etaEl.textContent = etaInlineText;
  if (etaWrapEl) etaWrapEl.style.display = lvl >= 99 ? "none" : "inline-flex";
  if (gamesPerHourInlineEl) gamesPerHourInlineEl.textContent = "Games/h: —";
  if (toLevel99El) toLevel99El.textContent = lvl >= 99 ? "0 runs (0s)" : "—";
  if (gameTiming.completedGames > 0 && gameTiming.completedTotalDuration > 0) {
    const avgGameDuration = gameTiming.completedTotalDuration / gameTiming.completedGames;
    const gamesPerHour = Math.ceil(3600000 / avgGameDuration);
    if (gamesPerHourInlineEl) gamesPerHourInlineEl.textContent = `Games/h: ${gamesPerHour}`;

    const level99Threshold = XP_TABLE[99] ? XP_TABLE[99][0] : 0;
    const xpTo99 = Math.max(0, level99Threshold - exp);
    const xpPerGame = gained / gameTiming.completedGames;
    if (toLevel99El) {
      if (lvl >= 99 || xpTo99 <= 0) {
        toLevel99El.textContent = "0 runs (0s)";
      } else if (isFinite(xpPerGame) && xpPerGame > 0) {
        const runsTo99 = estimateRunsToLevel99(exp, lvl, xpPerGame);
        if (!isFinite(runsTo99) || runsTo99 <= 0) {
          toLevel99El.textContent = "—";
        } else {
          const timeTo99Ms = runsTo99 * avgGameDuration;
          toLevel99El.textContent = `${formatNumber(runsTo99)} runs (${formatDurationHMS(timeTo99Ms)})`;
        }
      }
    }
  }
  if (diffEl) diffEl.textContent = `${diff}`;
  if (areaEl) areaEl.textContent = `${area}`;
  if (pingEl) pingEl.textContent = `Ping: ${ping}ms`;
  if (lifeEl) lifeEl.textContent = `Life: ${life}/${maxLife}`;
  if (manaEl) manaEl.textContent = `Mana: ${mana}/${maxMana}`;
  if (mfEl) mfEl.textContent = `MF: ${mf}%`;
  if (gfEl) gfEl.textContent = `GF: ${gf}%`;
  // Use locale-aware thousands separators from the current browser/OS locale.
  if (goldEl) goldEl.textContent = `Gold: ${formatNumber(gold)}`;
  if (resEl)
    resEl.innerHTML = `<span class="res-fr">FR: ${fr}</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span class="res-cr">CR: ${cr}</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span class="res-lr">LR: ${lr}</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span class="res-pr">PR: ${pr}</span>`;
}

// Helpers to prettify class/difficulty
function titleCase(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function deriveClassName(raw) {
  if (!raw) return "";
  const lower = raw.toLowerCase();
  // If raw already equals a known class name, just title-case it
  const known = [
    "amazon",
    "assassin",
    "barbarian",
    "druid",
    "necromancer",
    "paladin",
    "sorceress",
  ];
  for (const k of known) {
    if (lower === k) return titleCase(k);
  }
  // Heuristics: detect by containment
  if (lower.includes("sorc")) return "Sorceress";
  if (lower.includes("paladin")) return "Paladin";
  if (lower.includes("barb")) return "Barbarian";
  if (lower.includes("assassin") || lower.includes("sin")) return "Assassin";
  if (lower.includes("druid")) return "Druid";
  if (lower.includes("amazon")) return "Amazon";
  if (lower.includes("necromancer") || lower.includes("necro"))
    return "Necromancer";
  // Fallback: split on underscores and title-case first part
  const base = lower.split("_")[0];
  return titleCase(base);
}

function formatNumber(n) {
  try {
    return Number(n).toLocaleString();
  } catch {
    return n;
  }
}

// Estimate runs to level 99 by applying the character-level XP penalty per target level.
function estimateRunsToLevel99(currentExp, currentLevel, observedXpPerGame) {
  if (
    !isFinite(currentExp) ||
    !isFinite(currentLevel) ||
    !isFinite(observedXpPerGame) ||
    observedXpPerGame <= 0 ||
    currentLevel >= 99
  ) {
    return NaN;
  }

  const currentPenalty = getCharacterLevelPenaltyRatio(currentLevel);
  if (!isFinite(currentPenalty) || currentPenalty <= 0) {
    return NaN;
  }

  // Normalize observed XP/game to a penalty-free baseline, then re-apply per target level.
  const baselineXpPerGame = observedXpPerGame / currentPenalty;
  if (!isFinite(baselineXpPerGame) || baselineXpPerGame <= 0) {
    return NaN;
  }

  let totalRuns = 0;
  for (let level = currentLevel; level < 99; level++) {
    const levelEntry = XP_TABLE[level];
    if (!levelEntry || levelEntry.length < 2) {
      return NaN;
    }

    const levelStartExp = levelEntry[0];
    const xpToNextLevel = levelEntry[1];
    if (!isFinite(levelStartExp) || !isFinite(xpToNextLevel) || xpToNextLevel <= 0) {
      continue;
    }

    const xpNeededAtLevel =
      level === currentLevel
        ? Math.max(0, levelStartExp + xpToNextLevel - currentExp)
        : xpToNextLevel;
    if (xpNeededAtLevel <= 0) {
      continue;
    }

    const levelPenalty = getCharacterLevelPenaltyRatio(level);
    const effectiveXpPerGame = baselineXpPerGame * levelPenalty;
    if (!isFinite(effectiveXpPerGame) || effectiveXpPerGame <= 0) {
      return NaN;
    }

    totalRuns += xpNeededAtLevel / effectiveXpPerGame;
  }

  return Math.ceil(totalRuns);
}

// Source: The Arreat Summit "Experience" table (Character Levels 70-98).
function getCharacterLevelPenaltyRatio(level) {
  if (!isFinite(level)) {
    return 1;
  }

  if (level < 70) {
    return 1;
  }

  return XP_LEVEL_PENALTY_BY_LEVEL[level] ?? 0.0059;
}

function updateRunStats(card, games) {
  const runStats = calculateRunStats(games);
  const runStatsElement = card.querySelector(".run-stats");
  runStatsElement.innerHTML = "<h3>Run Statistics</h3>";

  if (Object.keys(runStats).length === 0) {
    runStatsElement.innerHTML += "<p>No run data available yet.</p>";
    return;
  }

  const runStatsGrid = document.createElement("div");
  runStatsGrid.className = "run-stats-grid";

  for (const [runName, stats] of Object.entries(runStats)) {
    const runElement = document.createElement("div");
    runElement.className = "run-stat";
    if (stats.isCurrentRun) {
      runElement.classList.add("current-run");
    }
    runElement.innerHTML = `
            <h4>${runName}${stats.isCurrentRun
        ? ' <span class="current-run-indicator">Current</span>'
        : ""
      }</h4>
            <div class="run-stat-content">
                <div class="run-stat-item" title="Fastest Run">
                    <span class="stat-label">Fastest:</span> ${formatDuration(
        stats.shortestTime
      )}
                </div>
                <div class="run-stat-item" title="Slowest Run">
                    <span class="stat-label">Slowest:</span> ${formatDuration(
        stats.longestTime
      )}
                </div>
                <div class="run-stat-item" title="Average Run">
                    <span class="stat-label">Average:</span> ${formatDuration(
        stats.averageTime
      )}
                </div>
                <div class="run-stat-item" title="Total Runs">
                    <span class="stat-label">Total:</span> ${stats.runCount}
                </div>
                <div class="run-stat-item" title="Errors">
                    <span class="stat-label">Errors:</span> ${stats.errorCount}
                </div>
                <div class="run-stat-item" title="Chickens">
                    <span class="stat-label">Chickens:</span> ${stats.runChickens
      }
                </div>
                <div class="run-stat-item" title="Deaths">
                    <span class="stat-label">Deaths:</span> ${stats.runDeaths}
                </div>
            </div>
        `;
    runStatsGrid.appendChild(runElement);
  }

  runStatsElement.appendChild(runStatsGrid);
}

function calculateRunStats(games) {
  if (!games || games.length === 0) {
    return {};
  }

  const runStats = {};

  games.forEach((game) => {
    if (game.Runs && Array.isArray(game.Runs)) {
      game.Runs.forEach((run) => {
        if (!runStats[run.Name]) {
          runStats[run.Name] = {
            shortestTime: Infinity,
            longestTime: 0,
            totalTime: 0,
            errorCount: 0,
            runCount: 0,
            runChickens: 0,
            runDeaths: 0,
            successfulRunCount: 0,
            isCurrentRun: false,
          };
        }

        // Check if this is the current run
        if (run.Reason === "") {
          runStats[run.Name].isCurrentRun = true;
        }

        const runTime = new Date(run.FinishedAt) - new Date(run.StartedAt);
        if (run.FinishedAt !== "0001-01-01T00:00:00Z" && runTime > 0) {
          runStats[run.Name].runCount++;

          if (run.Reason === "ok") {
            runStats[run.Name].shortestTime = Math.min(
              runStats[run.Name].shortestTime,
              runTime
            );
            runStats[run.Name].longestTime = Math.max(
              runStats[run.Name].longestTime,
              runTime
            );
            runStats[run.Name].totalTime += runTime;
            runStats[run.Name].successfulRunCount++;
          }
        }

        if (run.Reason == "error") {
          runStats[run.Name].errorCount++;
        }

        if (run.Reason == "chicken") {
          runStats[run.Name].runChickens++;
        }

        if (run.Reason == "death") {
          runStats[run.Name].runDeaths++;
        }
      });
    }
  });

  // Calculate average time for successful runs
  for (const stats of Object.values(runStats)) {
    if (stats.successfulRunCount > 0) {
      stats.averageTime = stats.totalTime / stats.successfulRunCount;
    } else {
      stats.shortestTime = 0;
      stats.longestTime = 0;
      stats.averageTime = 0;
    }
  }

  return runStats;
}

function calculateStats(games) {
  if (!games || games.length === 0) {
    return { totalGames: 0, totalChickens: 0, totalDeaths: 0, totalErrors: 0 };
  }

  return games.reduce(
    (acc, game) => {
      acc.totalGames++;
      if (game.Reason === "chicken") acc.totalChickens++;
      else if (game.Reason === "death") acc.totalDeaths++;
      else if (game.Reason === "error") acc.totalErrors++;
      return acc;
    },
    { totalGames: 0, totalChickens: 0, totalDeaths: 0, totalErrors: 0 }
  );
}

function formatDuration(ms) {
  if (!isFinite(ms) || ms < 0) {
    return "N/A";
  }
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

function formatDurationHMS(ms) {
  if (!isFinite(ms) || ms < 0) {
    return "N/A";
  }
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const remainingAfterDays = totalSeconds % 86400;
  const hours = Math.floor(remainingAfterDays / 3600);
  const minutes = Math.floor((remainingAfterDays % 3600) / 60);
  const seconds = remainingAfterDays % 60;

  // Keep the output compact by hiding units that are still zero.
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  const totalHours = Math.floor(totalSeconds / 3600);
  if (totalHours > 0) {
    return `${totalHours}h ${minutes}m ${seconds}s`;
  }

  const totalMinutes = Math.floor(totalSeconds / 60);
  if (totalMinutes > 0) {
    return `${totalMinutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

function saveExpandedState() {
  const expandedCards = Array.from(
    document.querySelectorAll(".character-card.expanded")
  ).map((card) => card.id);
  localStorage.setItem("expandedCards", JSON.stringify(expandedCards));
}

function restoreExpandedState() {
  const expandedCards = JSON.parse(localStorage.getItem("expandedCards")) || [];
  expandedCards.forEach((cardId) => {
    const card = document.getElementById(cardId);
    if (card) {
      card.classList.add("expanded");
      const toggleBtn = card.querySelector(".toggle-details i");
      if (toggleBtn) {
        toggleBtn.style.transform = "rotate(180deg)";
      }
    }
  });
}

function showAttachPopup(characterName) {
  const popup = document.createElement("div");
  popup.className = "attach-popup";
  popup.innerHTML = `
            <h3>Attach to Process</h3>
            <div id="popup-content">
                <div class="loading-spinner"></div>
                <p>Loading processes...</p>
            </div>
        `;

  document.body.appendChild(popup);

  // Fetch and populate the process list
  fetchProcessList(characterName);
}

function fetchProcessList(characterName) {
  fetch("/process-list")
    .then((response) => response.json())
    .then((processes) => {
      const popup = document.querySelector(".attach-popup");

      if (!processes || processes.length === 0) {
        popup.innerHTML = `
                        <h3>No D2R Processes Found</h3>
                        <p>There are no Diablo II: Resurrected processes currently running.</p>
                        <button onclick="closeAttachPopup()" class="btn btn-primary">Close</button>
                    `;
      } else {
        popup.innerHTML = `
                        <h3>Attach to Process</h3>
                        <input type="text" id="process-search" placeholder="Search processes...">
                        <table>
                            <thead>
                                <tr>
                                    <th>Window Title</th>
                                    <th>Process Name</th>
                                    <th>PID</th>
                                </tr>
                            </thead>
                            <tbody id="process-list-body"></tbody>
                        </table>
                        <div class="selected-process">
                            <span>Selected Process: </span>
                            <span id="selected-pid">None</span>
                        </div>
                        <div class="popup-buttons">
                            <button id="choose-process" class="btn btn-primary" disabled>Attach</button>
                            <button id="cancel-attach" class="btn">Cancel</button>
                        </div>
                    `;

        const tbody = document.getElementById("process-list-body");
        processes.forEach((process) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                            <td>${process.windowTitle}</td>
                            <td>${process.processName}</td>
                            <td>${process.pid}</td>
                        `;
          row.addEventListener("click", () => selectProcess(row, process.pid));
          tbody.appendChild(row);
        });

        // Add event listeners
        document
          .getElementById("choose-process")
          .addEventListener("click", () => chooseProcess(characterName));
        document
          .getElementById("cancel-attach")
          .addEventListener("click", closeAttachPopup);
        document
          .getElementById("process-search")
          .addEventListener("input", filterProcessList);
      }
    })
    .catch((error) => {
      console.error("Error fetching process list:", error);
      const popup = document.querySelector(".attach-popup");
      popup.innerHTML = `
                    <h3>Error</h3>
                    <p>An error occurred while fetching the process list.</p>
                    <button onclick="closeAttachPopup()" class="btn btn-primary">Close</button>
                `;
    });
}

function selectProcess(row, pid) {
  const allRows = document.querySelectorAll("#process-list-body tr");
  allRows.forEach((r) => r.classList.remove("selected"));
  row.classList.add("selected");
  document.getElementById("choose-process").disabled = false;
  document.getElementById("choose-process").dataset.pid = pid;
  document.getElementById("selected-pid").textContent = pid;
}

function chooseProcess(characterName) {
  const pid = document.getElementById("choose-process").dataset.pid;
  if (pid) {
    // Show loading animation
    const popup = document.querySelector(".attach-popup");
    popup.innerHTML = `
                <h3>Attaching to Process</h3>
                <div class="loading-spinner"></div>
                <p>Please wait...</p>
            `;

    fetch(`/attach-process?characterName=${characterName}&pid=${pid}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Show success message
          popup.innerHTML = `
                            <h3>Success</h3>
                            <p>Successfully attached to process ${pid} for character ${characterName}</p>
                        `;
          // Close popup after 2 seconds
          setTimeout(() => {
            closeAttachPopup();
            fetchInitialData(); // Refresh the dashboard
          }, 2000);
        } else {
          // Show error message
          popup.innerHTML = `
                            <h3>Error</h3>
                            <p>Failed to attach to process: ${data.error}</p>
                            <button onclick="closeAttachPopup()" class="btn btn-primary">Close</button>
                        `;
        }
      })
      .catch((error) => {
        console.error("Error attaching to process:", error);
        // Show error message
        popup.innerHTML = `
                        <h3>Error</h3>
                        <p>An error occurred while attaching to the process.</p>
                        <button onclick="closeAttachPopup()" class="btn btn-primary">Close</button>
                    `;
      });
  }
}

async function reloadConfig() {
  const btn = document.getElementById("reloadConfigBtn");
  const icon = btn.querySelector("i");

  // Disable button and start rotation
  btn.disabled = true;
  icon.classList.add("rotate");

  try {
    const response = await fetch("/api/reload-config");
    if (!response.ok) {
      throw new Error("Failed to reload config");
    }
  } catch (error) {
    console.error("Error reloading config:", error);
  } finally {
    // Re-enable button and stop rotation
    btn.disabled = false;
    icon.classList.remove("rotate");
  }
}

function closeAttachPopup() {
  const popup = document.querySelector(".attach-popup");
  if (popup) {
    popup.remove();
  }
}

function filterProcessList() {
  const searchTerm = document
    .getElementById("process-search")
    .value.toLowerCase();
  const rows = document.querySelectorAll("#process-list-body tr");

  rows.forEach((row) => {
    const windowTitle = row.cells[0].textContent.toLowerCase();
    const processName = row.cells[1].textContent.toLowerCase();
    if (windowTitle.includes(searchTerm) || processName.includes(searchTerm)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

function showCompanionJoinPopup(characterName) {
  const popup = document.createElement("div");
  popup.className = "attach-popup"; // Reuse the attach popup styling
  popup.innerHTML = `
            <h3>Join Game as Companion</h3>
            <div class="popup-content">
                <div class="form-group">
                    <label for="game-name">Game Name:</label>
                    <input type="text" id="game-name" placeholder="Enter game name">
                </div>
                <div class="form-group">
                    <label for="game-password">Game Password:</label>
                    <input type="text" id="game-password" placeholder="Enter game password">
                </div>
                <div class="popup-buttons">
                    <button id="join-game-btn" class="btn btn-primary">Request Join</button>
                    <button id="cancel-join" class="btn">Cancel</button>
                </div>
            </div>
        `;

  document.body.appendChild(popup);

  // Add event listeners
  document.getElementById("join-game-btn").addEventListener("click", () => {
    const gameName = document.getElementById("game-name").value.trim();
    const password = document.getElementById("game-password").value.trim();

    if (!gameName) {
      alert("Please enter a game name");
      return;
    }

    requestCompanionJoin(characterName, gameName, password);
  });

  document
    .getElementById("cancel-join")
    .addEventListener("click", closeCompanionJoinPopup);
}

function closeCompanionJoinPopup() {
  const popup = document.querySelector(".attach-popup");
  if (popup) {
    popup.remove();
  }
}

function requestCompanionJoin(supervisor, gameName, password) {
  // Show loading animation
  const popup = document.querySelector(".attach-popup");
  popup.innerHTML = `
            <h3>Requesting Game Join</h3>
            <div class="loading-spinner"></div>
            <p>Please wait...</p>
        `;

  fetch("/api/companion-join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      supervisor: supervisor,
      gameName: gameName,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Show success message
        popup.innerHTML = `
                    <h3>Success</h3>
                    <p>Join request sent for game "${gameName}"</p>
                `;
        // Close popup after 2 seconds
        setTimeout(() => {
          closeCompanionJoinPopup();
        }, 2000);
      } else {
        // Show error message
        popup.innerHTML = `
                    <h3>Error</h3>
                    <p>Failed to send join request: ${data.error || "Unknown error"
          }</p>
                    <button onclick="closeCompanionJoinPopup()" class="btn btn-primary">Close</button>
                `;
      }
    })
    .catch((error) => {
      console.error("Error sending join request:", error);
      // Show error message
      popup.innerHTML = `
                <h3>Error</h3>
                <p>An error occurred while sending the join request.</p>
                <button onclick="closeCompanionJoinPopup()" class="btn btn-primary">Close</button>
            `;
    });
}

function openPickitEditor() {
  // Get the current host and port
  const url =
    window.location.protocol + "//" + window.location.host + "/pickit-editor";

  // Open in default browser
  window.open(url, "_blank");
}

function openDropManager() {
  const url =
    window.location.protocol + "//" + window.location.host + "/Drop-manager";

  window.location.href = url;
}

document.addEventListener("DOMContentLoaded", function () {
  fetchInitialData();
  connectWebSocket();
  restoreExpandedState();
});
