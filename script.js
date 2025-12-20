const form = document.getElementById("risk-form");
const results = document.getElementById("results");
const scoreEl = document.getElementById("risk-score");
const levelEl = document.getElementById("risk-level");
const incomeEl = document.getElementById("income-shift");
const nextStepsEl = document.getElementById("next-steps");
const tagsEl = document.getElementById("score-tags");
const offerForm = document.querySelector(".offer__form");
const shareHeadline = document.getElementById("share-headline");
const shareSubline = document.getElementById("share-subline");
const shareScore = document.getElementById("share-score");
const shareAngle = document.getElementById("share-angle");
const shareX = document.getElementById("share-x");
const shareReddit = document.getElementById("share-reddit");
const shareTikTok = document.getElementById("share-tiktok");
const copyButtons = document.querySelectorAll("[data-copy-platform]");
const shareLogCount = document.getElementById("share-log-count");
const shareEvents = JSON.parse(localStorage.getItem("shareEvents") || "[]");

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

function getArchetype(score) {
  if (score >= 70) {
    return {
      name: "Signal Defense Operator",
      insight: "You spot where automation steals margin and pivot fast.",
      angle: "Lead with de-risking plays before AI cuts into revenue.",
      hook: "Seeing how fast AI can undercut a role is wild—here's my pivot.",
    };
  }

  if (score >= 40) {
    return {
      name: "Opportunity Splitter",
      insight: "You balance automation with human trust loops for leverage.",
      angle: "Blend AI delivery with collaboration to expand retainers.",
      hook: "Turns out the sweet spot is part human, part automation.",
    };
  }

  return {
    name: "Compound Leverage Builder",
    insight: "You trade low-risk tasks for high-signal strategy and partnerships.",
    angle: "Double down on productized offers while AI handles grunt work.",
    hook: "Feels like the perfect lane to build defensible IP with AI as a cofounder.",
  };
}

function buildShareContent(score) {
  const archetype = getArchetype(score);
  const referral = "Took this free quiz → https://tipvault22.com/ai-job-risk";

  const blurbs = {
    x: `My Side-Hustle Archetype is ${archetype.name} (${score}/100). ${archetype.hook} ${referral}`,
    reddit: `I just ran my role through an AI job risk check and landed as a "${archetype.name}" (score ${score}/100). It highlighted that ${archetype.insight} Curious what others score. ${referral}`,
    tiktok: `AI graded me a "${archetype.name}" 🤔 Score ${score}/100. ${archetype.hook} What lane are you in? ${referral}`,
  };

  return { archetype, blurbs };
}

function calculateScore(data) {
  const automation = Number(data.get("automation"));
  const collaboration = 100 - Number(data.get("collaboration"));
  const tools = Number(data.get("tools"));
  const regulation = 100 - Number(data.get("regulation"));
  const upskill = Number(data.get("upskill"));

  const weightedScore =
    automation * 0.28 + collaboration * 0.16 + tools * 0.22 + regulation * 0.18 + upskill * 0.16;

  return Math.round(Math.min(Math.max(weightedScore, 0), 100));
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

function renderResults(score) {
  const { label, color } = formatIncomeChange(score);
  const steps = buildSteps(score);
  const tags = buildTags(score);
  const { archetype, blurbs } = buildShareContent(score);

  scoreEl.textContent = score;
  levelEl.textContent = describeLevel(score);
  levelEl.dataset.state = color;

  incomeEl.textContent = label;
  incomeEl.dataset.state = color;

  nextStepsEl.innerHTML = steps.map((step) => `<li>${step}</li>`).join("");

  tagsEl.innerHTML = tags.map((tag) => `<li>${tag}</li>`).join("");

  if (shareHeadline && shareSubline && shareScore && shareAngle) {
    shareHeadline.textContent = `My Side-Hustle Archetype Is ${archetype.name}`;
    shareSubline.textContent = archetype.insight;
    shareScore.textContent = score;
    shareAngle.textContent = archetype.angle;
  }

  if (shareX && shareReddit && shareTikTok) {
    shareX.textContent = blurbs.x;
    shareReddit.textContent = blurbs.reddit;
    shareTikTok.textContent = blurbs.tiktok;
  }

  copyButtons.forEach((button) => {
    const platform = button.dataset.copyPlatform;
    const text = blurbs[platform];
    if (text) {
      button.dataset.copyText = text;
    }
  });

  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderShareLog() {
  if (!shareLogCount) return;
  const total = shareEvents.length;
  shareLogCount.textContent = `${total} share${total === 1 ? "" : "s"} tracked.`;
}

async function copyShareText(platform, text) {
  if (!text) {
    showToast("Run the quiz first to generate your shareable blurbs.");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const fallbackArea = document.createElement("textarea");
    fallbackArea.value = text;
    document.body.appendChild(fallbackArea);
    fallbackArea.select();
    document.execCommand("copy");
    fallbackArea.remove();
  }

  shareEvents.push({ platform, text, timestamp: new Date().toISOString() });
  localStorage.setItem("shareEvents", JSON.stringify(shareEvents));
  renderShareLog();
  showToast("Copied! Paste it and spark replies.");
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const score = calculateScore(formData);
  renderResults(score);
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

renderShareLog();

copyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const platform = button.dataset.copyPlatform;
    const text = button.dataset.copyText;
    copyShareText(platform, text);
  });
});
