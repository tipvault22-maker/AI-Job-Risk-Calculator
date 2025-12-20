const form = document.getElementById("risk-form");
const results = document.getElementById("results");
const scoreEl = document.getElementById("risk-score");
const levelEl = document.getElementById("risk-level");
const incomeEl = document.getElementById("income-shift");
const nextStepsEl = document.getElementById("next-steps");
const tagsEl = document.getElementById("score-tags");
const breakdownEl = document.getElementById("score-breakdown");
const offerForm = document.querySelector(".offer__form");
const copyButton = document.getElementById("copy-summary");
const sharePreview = document.getElementById("share-preview");

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.dataset.visible = "true";

  setTimeout(() => {
    toast.dataset.visible = "false";
  }, 3200);
}

function updateRangeOutputs() {
  document.querySelectorAll(".quiz__range-output").forEach((output) => {
    const target = document.getElementById(output.dataset.for);
    if (!target) return;
    output.textContent = `${target.value}%`;
    target.addEventListener("input", () => {
      output.textContent = `${target.value}%`;
    });
  });
}

function formatIncomeChange(score) {
  if (score >= 70) {
    return {
      label: "Urgent: Protect up to $32,000 in annual income by pivoting service mix now.",
      color: "danger",
    };
  }
  if (score >= 40) {
    return {
      label: "Stabilize: Capture $18,500 in upside by automating delivery & packaging new offers.",
      color: "warning",
    };
  }
  return {
    label: "Momentum: You could unlock +$26,400 with partnerships and productized retainers.",
    color: "success",
  };
}

function buildSteps(score) {
  if (score >= 70) {
    return [
      "Audit repetitive deliverables and productize the strategy layer only.",
      "Bundle human-led collaboration (workshops, stakeholder sessions) at premium rates.",
      "Book a premium playbook call to re-skill into high-barrier niches within 30 days.",
    ];
  }
  if (score >= 40) {
    return [
      "Deploy AI tooling to compress fulfillment time by 40% and reinvest in client acquisition.",
      "Launch a mini-education offer to prove authority and drive upsells to retainers.",
      "Lock in an accountability partner to execute the Premium Monetization Playbook roadmap.",
    ];
  }
  return [
    "Double down on AI leverage by creating proprietary frameworks and licensing them.",
    "Spin up a performance-based offer that charges for outcomes, not hours.",
    "Scale authority through weekly thought-leadership sprints powered by automation.",
  ];
}

function buildTags(score) {
  if (score >= 70) {
    return ["High Automation Exposure", "Immediate Offer Pivot", "Revenue Protection Mode"];
  }
  if (score >= 40) {
    return ["Balanced Automation", "Leverage AI Tools", "Pipeline Expansion"];
  }
  return ["Low Automation Risk", "Scale Partnerships", "Launch Premium Offers"];
}

function buildShareText(score) {
  const level = describeLevel(score);
  const { label } = formatIncomeChange(score);
  return `Just ran the AI Job Risk Calculator: scored ${score}/100. ${level} ${label} What'd you get?`;
}

function calculateScore(data) {
  const automation = Number(data.get("automation")) || 0;
  const collaborationRaw = Number(data.get("collaboration")) || 0;
  const collaboration = 100 - collaborationRaw;
  const tools = Number(data.get("tools")) || 0;
  const regulationRaw = Number(data.get("regulation")) || 0;
  const regulation = 100 - regulationRaw;
  const upskill = Number(data.get("upskill")) || 0;

  const weights = {
    automation: 0.28,
    collaboration: 0.16,
    tools: 0.22,
    regulation: 0.18,
    upskill: 0.16,
  };

  const inputs = {
    automation,
    collaboration,
    tools,
    regulation,
    upskill,
  };

  const factorDetails = {
    automation: {
      label: "Task repeatability",
      detail: `${automation}% of your day is repeatable or rules-based.`,
    },
    collaboration: {
      label: "Human collaboration",
      detail: `${collaborationRaw}% of your work depends on human interaction.`,
    },
    tools: {
      label: "AI tool adoption",
      detail: tools === 70 ? "You rarely use AI tools today." : "You are experimenting with AI regularly.",
    },
    regulation: {
      label: "Industry regulation",
      detail: `${regulationRaw}% regulatory buffer slows automation in your field.`,
    },
    upskill: {
      label: "Upskilling cadence",
      detail: upskill === 65 ? "Under 4 hours a month invested in new skills." : "Consistent learning time logged each month.",
    },
  };

  const breakdown = Object.entries(inputs).map(([key, value]) => {
    const weight = weights[key];
    return {
      label: factorDetails[key].label,
      detail: factorDetails[key].detail,
      weight,
      contribution: Math.round(value * weight * 10) / 10,
    };
  });

  const weightedScore = breakdown.reduce((total, item) => total + item.contribution, 0);

  return {
    score: Math.round(Math.min(Math.max(weightedScore, 0), 100)),
    breakdown,
  };
}

function describeLevel(score) {
  if (score >= 70) {
    return "High Exposure — automation is eroding core tasks. Pivot service mix ASAP.";
  }
  if (score >= 40) {
    return "Moderate Exposure — with intentional AI leverage you can unlock new income streams.";
  }
  return "Low Exposure — you're well-positioned to capitalize on AI-driven opportunities.";
}

function renderResults(score, breakdown) {
  const { label, color } = formatIncomeChange(score);
  const steps = buildSteps(score);
  const tags = buildTags(score);
  const shareText = buildShareText(score);

  scoreEl.textContent = score;
  levelEl.textContent = describeLevel(score);
  levelEl.dataset.state = color;

  incomeEl.textContent = label;
  incomeEl.dataset.state = color;

  nextStepsEl.innerHTML = steps.map((step) => `<li>${step}</li>`).join("");

  tagsEl.innerHTML = tags.map((tag) => `<li>${tag}</li>`).join("");

  if (sharePreview) {
    sharePreview.textContent = shareText;
  }

  if (copyButton) {
    copyButton.dataset.summary = shareText;
  }

  if (breakdownEl && Array.isArray(breakdown)) {
    breakdownEl.innerHTML = breakdown
      .map(
        (item) => `
        <li class="breakdown__item">
          <div class="breakdown__row">
            <div>
              <p class="breakdown__label">${item.label}</p>
              <p class="breakdown__detail">${item.detail}</p>
            </div>
            <div class="breakdown__meta">
              <span class="breakdown__weight">${Math.round(item.weight * 100)}% weight</span>
              <span class="breakdown__score">+${item.contribution}</span>
            </div>
          </div>
          <div class="breakdown__bar" role="presentation">
            <span style="width: ${item.contribution}%;"></span>
          </div>
        </li>
      `
      )
      .join("");
  }

  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const { score, breakdown } = calculateScore(formData);
  renderResults(score, breakdown);
});

updateRangeOutputs();

offerForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = new FormData(offerForm).get("email");
  if (typeof email === "string" && email.trim()) {
    showToast("Seat reserved! Check your inbox for onboarding instructions.");
    offerForm.reset();
  }
});

copyButton?.addEventListener("click", async () => {
  const summary = copyButton.dataset.summary;
  if (!summary) {
    showToast("Run the quiz first to generate your shareable blurb.");
    return;
  }

  try {
    await navigator.clipboard.writeText(summary);
    showToast("Copied! Post it to invite replies about your score.");
  } catch (error) {
    const fallbackArea = document.createElement("textarea");
    fallbackArea.value = summary;
    document.body.appendChild(fallbackArea);
    fallbackArea.select();
    document.execCommand("copy");
    fallbackArea.remove();
    showToast("Copied! Post it to invite replies about your score.");
  }
});
