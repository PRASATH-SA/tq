/* =========================================================
   IKIGAI OPTION → DIMENSION MAP
========================================================= */

const optionToDimension = {
  "Reading": "GROWTH",
  "Exercising": "GROWTH",
  "Creating": "LOVE",
  "Helping": "VALUE",

  "Logic": "SKILL",
  "Intuition": "LOVE",
  "Discussion": "VALUE",
  "Analysis": "SKILL",

  "Planning": "SKILL",
  "Achieving": "IMPACT",

  "Research": "SKILL",
  "Ask": "VALUE",
  "Act": "IMPACT",
  "Reflect": "GROWTH",

  "Write": "GROWTH",
  "Visualize": "LOVE",
  "Discuss": "VALUE",
  "Do": "SKILL",

  "Growth": "GROWTH",
  "Recognition": "IMPACT",
  "Joy": "LOVE",
  "Rewards": "IMPACT"
};

/* =========================================================
   PHASE 4 – IKIGAI MEANING + HIGHLIGHT
========================================================= */

if (document.getElementById("ikigaiText")) {

  const stats = JSON.parse(localStorage.getItem("ikigaiStats")) || {};

  const sorted = Object.entries(stats)
    .sort((a, b) => b[1] - a[1]);

  const primary = sorted[0]?.[0];
  const secondary = sorted[1]?.[0];

  const insightMap = {
    LOVE: "You are driven by passion and inner joy. When your work aligns with what you love, you feel most alive.",
    SKILL: "Mastery and competence define you. You thrive when improving, refining, and becoming exceptional.",
    VALUE: "You seek meaning through contribution. Helping others and creating value fuels your purpose.",
    GROWTH: "Learning and evolution guide your path. Growth itself is what motivates you forward.",
    IMPACT: "You are energized by influence and results. Making a visible difference matters deeply to you."
  };

  const comboMap = {
    "LOVE_SKILL": "Your Ikigai lies where passion meets mastery. Creative skill-building paths will feel natural.",
    "LOVE_VALUE": "You are fulfilled when doing what you love while serving others.",
    "SKILL_IMPACT": "You thrive when expertise turns into tangible results.",
    "VALUE_IMPACT": "Your purpose is rooted in meaningful contribution and real-world change.",
    "GROWTH_LOVE": "Exploration and curiosity shape your identity and direction."
  };

  let text = insightMap[primary] || "Your Ikigai is taking shape.";

  if (primary && secondary) {
    const key = `${primary}_${secondary}`;
    const reverseKey = `${secondary}_${primary}`;
    if (comboMap[key]) text = comboMap[key];
    else if (comboMap[reverseKey]) text = comboMap[reverseKey];
  }

  document.getElementById("ikigaiText").textContent = text;

  // Highlight dominant labels
  document.querySelectorAll(".stats-label").forEach(label => {
    if (label.dataset.dim === primary) {
      label.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".reveal")?.classList.add("fade-in");
});


/* =========================================================
   SURVEY PAGE LOGIC (unchanged)
========================================================= */
if (document.querySelector('.intent-grid')) {
  const cards = document.querySelectorAll('.intent-card');
  const continueBtn = document.getElementById('continueBtn');

  let selectedIntent = null;

  cards.forEach(card => {
    card.addEventListener('click', () => {

      // remove selection from all
      cards.forEach(c => c.classList.remove('selected'));

      // select current
      card.classList.add('selected');
      selectedIntent = card.dataset.intent;

      continueBtn.disabled = false;
    });
  });

  continueBtn.addEventListener('click', () => {
    localStorage.setItem(
      'userIntents',
      JSON.stringify([selectedIntent])
    );
    window.location.href = 'assessment.html';
  });
}

/* =========================================================
   ASSESSMENT PAGE LOGIC (unchanged)
========================================================= */
if (document.getElementById('question')) {
    const questions = [
        { text: "What activity makes you lose track of time?", options: ["Reading", "Exercising", "Creating", "Helping"] },
        { text: "How do you prefer to decide?", options: ["Logic", "Intuition", "Discussion", "Analysis"] },
        { text: "What energizes you?", options: ["Planning", "Creating", "Helping", "Achieving"] },
        { text: "First step in a challenge?", options: ["Research", "Ask", "Act", "Reflect"] },
        { text: "How do you remember best?", options: ["Write", "Visualize", "Discuss", "Do"] },
        { text: "What motivates you?", options: ["Growth", "Recognition", "Joy", "Rewards"] }
    ];

    let currentQuestion = 0;
    let answers = JSON.parse(localStorage.getItem('reflectionAnswers')) || [];

    const container = document.getElementById('container');
    const progress = document.getElementById('progress');
    const questionEl = document.getElementById('question');
    const optionsEl = document.getElementById('options');
    const backBtn = document.getElementById('backBtn');
    const continueBtn = document.getElementById('continueBtn');

    function loadQuestion() {
        progress.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
        questionEl.textContent = questions[currentQuestion].text;
        optionsEl.innerHTML = '';

        questions[currentQuestion].options.forEach((opt, i) => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = opt;
            div.onclick = () => selectOption(i);
            optionsEl.appendChild(div);
        });

        backBtn.style.display = currentQuestion > 0 ? 'inline-block' : 'none';
        continueBtn.style.display = 'none';
    }

    function selectOption(index) {
        answers[currentQuestion] = index;
        localStorage.setItem('reflectionAnswers', JSON.stringify(answers));

        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < questions.length) loadQuestion();
            else showContinue();
        }, 400);
    }

    function showContinue() {

    const stats = {
        LOVE: 0,
        SKILL: 0,
        VALUE: 0,
        GROWTH: 0,
        IMPACT: 0
    };

    const questionOptions = [
        ["Reading", "Exercising", "Creating", "Helping"],
        ["Logic", "Intuition", "Discussion", "Analysis"],
        ["Planning", "Creating", "Helping", "Achieving"],
        ["Research", "Ask", "Act", "Reflect"],
        ["Write", "Visualize", "Discuss", "Do"],
        ["Growth", "Recognition", "Joy", "Rewards"]
    ];

    answers.forEach((optIndex, qIndex) => {
        const selectedText = questionOptions[qIndex][optIndex];
        const dimension = optionToDimension[selectedText];
        if (dimension) stats[dimension]++;
    });

    localStorage.setItem('ikigaiStats', JSON.stringify(stats));

    progress.textContent = 'Reflection Complete';
    questionEl.textContent = 'Your answers have been saved.';
    optionsEl.innerHTML = '';
    continueBtn.style.display = 'inline-block';
}


    continueBtn.onclick = () => window.location.href = 'dashboard.html';
    backBtn.onclick = () => { currentQuestion--; loadQuestion(); };

    loadQuestion();
}

// //* ================================
//    STREAK BAR LOGIC (REPLACES CIRCLES)
// ================================ */

document.addEventListener("DOMContentLoaded", () => {

  const TOTAL_DAYS = 7;
  const completedDays = 4; // Su → We

  const fill = document.querySelector(".week-fill");
  const slots = document.querySelectorAll(".day-slot");

  fill.style.width = "0%";
  slots.forEach(s => s.classList.remove("done"));

  const step = 100 / (TOTAL_DAYS - 1);
  let currentDay = 0;

  function animateNextDay() {
    if (currentDay >= completedDays) return;

    const width =
      currentDay === 0 ? step * 0.35 : currentDay * step;

    fill.style.width = width + "%";

    setTimeout(() => {
      slots[currentDay].classList.add("done");
    }, 300);

    currentDay++;
    setTimeout(animateNextDay, 600);
  }

  setTimeout(animateNextDay, 400);
});

/* =========================================================
   DAILY PAGE LOGIC (unchanged)
========================================================= */
if (document.getElementById('prompt')) {
    const prompts = [
        "What activities made you lose track of time today?",
        "When did you feel most energized?",
        "What felt effortless?",
        "What brought joy?",
        "Where did you excel?",
        "When were you fully immersed?",
        "What made time disappear?"
    ];

    let currentDay = parseInt(localStorage.getItem('currentDay') || '0');
    const responses = JSON.parse(localStorage.getItem('dailyResponses')) || [];

    const promptDiv = document.getElementById('prompt');

    function renderPrompt() {
        promptDiv.innerHTML = `<div class="prompt-question">${prompts[currentDay]}</div>`;
    }

    window.saveResponse = function () {
        responses[currentDay] = true;
        localStorage.setItem('dailyResponses', JSON.stringify(responses));

        currentDay++;
        localStorage.setItem('currentDay', currentDay);

        if (currentDay >= 7) window.location.href = 'insights.html';
        else renderPrompt();
    };

    renderPrompt();
}

if (document.getElementById("ikigaiFill")) {

  const rawStats = JSON.parse(localStorage.getItem("ikigaiStats")) || {
    LOVE: 0,
    SKILL: 0,
    VALUE: 0,
    GROWTH: 0,
    IMPACT: 0
  };

  const max = Math.max(...Object.values(rawStats), 1);

  const values = {
    love:   rawStats.LOVE   / max,
    skill:  rawStats.SKILL  / max,
    value:  rawStats.VALUE  / max,
    growth: rawStats.GROWTH / max,
    impact: rawStats.IMPACT / max
  };

  function point(cx, cy, r, angle){
    const rad = (angle - 90) * Math.PI / 180;
    return `${cx + r * Math.cos(rad)},${cy + r * Math.sin(rad)}`;
  }

  const cx = 100;
  const cy = 100;
  const maxR = 70;

  const points = [
    point(cx, cy, maxR * values.love,   0),
    point(cx, cy, maxR * values.skill,  72),
    point(cx, cy, maxR * values.value, 144),
    point(cx, cy, maxR * values.growth,216),
    point(cx, cy, maxR * values.impact,288),
  ].join(" ");

  requestAnimationFrame(() => {
    document
      .getElementById("ikigaiFill")
      .setAttribute("points", points);
  });
}


