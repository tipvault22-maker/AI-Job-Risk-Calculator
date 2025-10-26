const industryWeights = {
  technology: 42,
  manufacturing: 68,
  finance: 55,
  healthcare: 30,
  education: 24,
  creative: 36,
  retail: 60,
  hospitality: 58,
  public: 20,
  other: 44,
};

const adoptionWeights = {
  cautious: 6,
  moderate: 14,
  aggressive: 22,
};

const humanTouchAdjustments = {
  low: 6,
  medium: -6,
  high: -14,
};

const actionLibrary = {
  low: [
    "Double down on the human touch: mentor peers, lead cross-functional projects.",
    "Build workflows that pair AI tools with your expertise to amplify output.",
    "Track AI pilots in your org so you can volunteer as an internal champion.",
  ],
  medium: [
    "Map the most repetitive tasks you own and design ways to automate them first.",
    "Upskill with data fluency, prompt design, or domain-specific AI certifications.",
    "Expand your network internally—relationships cushion transitions when roles shift.",
  ],
  high: [
    "Create an action plan with your manager: what skills do future roles need?",
    "Invest in resilience skills like change leadership and systems thinking.",
    "Build a portfolio that showcases innovation and ability to orchestrate AI tools.",
  ],
};

const insightLibrary = {
  industry: {
    manufacturing: "Heavy use of robotics and optimization keeps manufacturing among the most automated sectors.",
    retail: "Retail is rapidly adopting AI for inventory, logistics, and customer service.",
    finance: "Finance leans on AI for analysis and compliance, compressing certain analyst roles.",
    hospitality: "Hospitality sees automation in booking, check-in, and service bots, but human warmth still counts.",
    technology: "Tech leads the AI rollout, so skills can become obsolete quickly without upskilling.",
    healthcare: "Healthcare regulation slows automation but documentation and imaging are modernizing fast.",
    education: "Education remains people-centric, but AI tutoring tools are reshaping prep work.",
    creative: "Generative AI is disrupting content creation, yet distinctive brand voice is still prized.",
    public: "Public service modernizes slower but process automation is unlocking new workflows.",
    other: "Your sector is evolving—monitor peers to anticipate where automation hits first.",
  },
  automation: {
    low: "Your role blends creativity and variation, which keeps humans in the loop.",
    medium: "Some routine elements exist—design ways to partner with AI to remove drudgery.",
    high: "High repetition signals near-term automation risk. Proactively redesign these workflows.",
  },
  adoption: {
    cautious: "Slow adoption buys you time to prepare before large shifts land.",
    moderate: "Experiments are underway—volunteer to co-create new playbooks.",
    aggressive: "Rapid adoption means disruption and opportunity will arrive almost simultaneously.",
  },
  human: {
    low: "Low emphasis on human skills raises exposure. Showcase strategic thinking to rebalance.",
    medium: "Blend of technical and interpersonal work offers solid resilience if you keep learning.",
    high: "High human touch is a moat. Pair it with AI literacy to stay indispensable.",
  },
};

function normalizeScore(score) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function determineRiskLevel(score) {
  if (score < 35) {
    return { level: "Low", tone: "success", message: "Automation is more likely to become your copilot than your replacement. Keep leveling up to stay ahead." };
  }
  if (score < 65) {
    return { level: "Medium", tone: "warning", message: "AI will reshape parts of your workflow. The people who thrive will pair human judgment with smart automation." };
  }
  return { level: "High", tone: "danger", message: "Expect significant change. Prepare now by mapping new roles, reskilling, and leading the transformation instead of reacting to it." };
}

function calculateRisk(inputs) {
  const base = industryWeights[inputs.industry] ?? industryWeights.other;
  const automationImpact = Number(inputs.automation) * 3.2; // up to ~32
  const adoptionImpact = adoptionWeights[inputs.adoption];
  const humanAdjustment = humanTouchAdjustments[inputs.human];
  const experienceAdjustment = Math.min(inputs.experience * 0.8, 12);

  const rawScore =
    base +
    automationImpact +
    adoptionImpact +
    humanAdjustment -
    experienceAdjustment;

  const score = normalizeScore(rawScore);
  const { level, tone, message } = determineRiskLevel(score);

  return {
    score,
    level,
    tone,
    message,
  };
}

function buildInsightList(inputs, score) {
  const automationBand = inputs.automation <= 4 ? "low" : inputs.automation >= 8 ? "high" : "medium";

  return [
    insightLibrary.industry[inputs.industry] ?? insightLibrary.industry.other,
    insightLibrary.automation[automationBand],
    insightLibrary.adoption[inputs.adoption],
    insightLibrary.human[inputs.human],
    `Years of expertise (${inputs.experience}) dampen risk by ${Math.min(
      inputs.experience * 2,
      20
    )}% when paired with continuous learning.`,
    `Overall risk score: ${score}% — re-evaluate quarterly as strategies shift.`,
  ];
}

function populateList(element, items) {
  element.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    element.appendChild(li);
  });
}

function deriveActions(level) {
  return actionLibrary[level.toLowerCase()] ?? actionLibrary.medium;
}

function updateMeter(fillEl, score) {
  fillEl.style.width = `${score}%`;
}

function getFormValues() {
  const industry = document.getElementById("industry").value;
  const automation = Number(document.getElementById("task-automation").value);
  const adoption = document.querySelector('input[name="ai-adoption"]:checked')?.value;
  const human = document.querySelector('input[name="human-touch"]:checked')?.value;
  const experience = Number(document.getElementById("experience").value || 0);

  return { industry, automation, adoption, human, experience };
}

function validate(inputs) {
  if (!inputs.industry) {
    return false;
  }
  if (!inputs.adoption || !inputs.human) {
    return false;
  }
  return true;
}

function showResults() {
  document.getElementById("results").classList.remove("hidden");
}

function handleSubmit(event) {
  event.preventDefault();
  const inputs = getFormValues();

  if (!validate(inputs)) {
    alert("Please answer each question so we can personalize your outlook.");
    return;
  }

  const { score, level, message } = calculateRisk(inputs);

  document.getElementById("score-value").textContent = `${score}%`;
  document.getElementById("risk-level").textContent = `${level} automation exposure`;
  document.getElementById("risk-message").textContent = message;

  updateMeter(document.getElementById("risk-meter-fill"), score);

  populateList(document.getElementById("insight-list"), buildInsightList(inputs, score));
  populateList(document.getElementById("action-list"), deriveActions(level));

  showResults();
}

function bindForm() {
  const form = document.getElementById("risk-form");
  form.addEventListener("submit", handleSubmit);
}

window.addEventListener("DOMContentLoaded", bindForm);
