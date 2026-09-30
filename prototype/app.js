const ONBOARDING_KEY = "safecircle:onboarding-v1";
const onboarding = document.querySelector("#onboarding");
const onboardingSlides = [...document.querySelectorAll(".onboarding-slide")];
const onboardingDots = [...document.querySelectorAll(".onboarding-dots span")];
const nextOnboarding = document.querySelector("#nextOnboarding");
let onboardingIndex = 0;

function renderOnboarding(index) {
  onboardingIndex = Math.max(0, Math.min(index, onboardingSlides.length - 1));
  onboardingSlides.forEach((slide, i) => slide.classList.toggle("active", i === onboardingIndex));
  onboardingDots.forEach((dot, i) => dot.classList.toggle("active", i === onboardingIndex));
  nextOnboarding.textContent = onboardingIndex === onboardingSlides.length - 1 ? "SafeCircle 시작하기" : "다음";
}

function openOnboarding() {
  renderOnboarding(0);
  onboarding.classList.remove("hidden");
  document.body.classList.add("onboarding-open");
}

function closeOnboarding() {
  localStorage.setItem(ONBOARDING_KEY, "seen");
  onboarding.classList.add("hidden");
  document.body.classList.remove("onboarding-open");
}

nextOnboarding?.addEventListener("click", () => {
  if (onboardingIndex >= onboardingSlides.length - 1) {
    closeOnboarding();
    return;
  }
  renderOnboarding(onboardingIndex + 1);
});

document.querySelector("#skipOnboarding")?.addEventListener("click", closeOnboarding);
document.querySelector("#replayOnboarding")?.addEventListener("click", openOnboarding);

if (localStorage.getItem(ONBOARDING_KEY) !== "seen") {
  openOnboarding();
}


const views = [...document.querySelectorAll(".view")];
const navItems = [...document.querySelectorAll(".nav-item")];
const networkBadge = document.querySelector("#networkBadge");
const appMain = document.querySelector("#appMain");
const form = document.querySelector("#mediationForm");
const result = document.querySelector("#mediationResult");
const start = document.querySelector("#helpStart");
const passPhonePanel = document.querySelector("#passPhonePanel");
const messageInput = document.querySelector("#message");
const feedbackStatus = document.querySelector("#feedbackStatus");
const actionStatus = document.querySelector("#actionStatus");
let mode = "before_send";
let cases = [];
let currentCase = null;

function setView(target) {
  views.forEach(v => v.classList.toggle("active", v.dataset.view === target));
  navItems.forEach(n => n.classList.toggle("active", n.dataset.target === target));
  appMain.focus({ preventScroll: true });
}
navItems.forEach(item => item.addEventListener("click", () => setView(item.dataset.target)));
document.querySelectorAll(".nav-shortcut").forEach(item => item.addEventListener("click", () => setView(item.dataset.target)));

function updateNetworkState() {
  const online = navigator.onLine;
  networkBadge.textContent = online ? "온라인" : "오프라인";
  networkBadge.classList.toggle("offline", !online);
}
window.addEventListener("online", updateNetworkState);
window.addEventListener("offline", updateNetworkState);
updateNetworkState();

const modeCopy = {
  before_send: ["말로 전하기", "어떤 말을 전하고 싶나요?"],
  understand_received: ["들은 말 이해하기", "어떤 말을 들었나요?"],
  together: ["같이 이야기하기", "먼저 어떤 말을 확인할까요?"]
};

function openMode(nextMode) {
  mode = nextMode;
  const [label, title] = modeCopy[mode] || modeCopy.before_send;
  document.querySelector("#formModeLabel").textContent = label;
  document.querySelector("#formTitle").textContent = title;
  start.classList.add("hidden");
  result.classList.add("hidden");
  passPhonePanel.classList.add("hidden");
  form.classList.remove("hidden");
  messageInput.focus();
}

document.querySelectorAll(".mode-button").forEach(button => {
  button.addEventListener("click", () => openMode(button.dataset.mode));
});

function resetToStart() {
  form.classList.add("hidden");
  result.classList.add("hidden");
  passPhonePanel.classList.add("hidden");
  start.classList.remove("hidden");
  messageInput.value = "";
  currentCase = null;
}
document.querySelector("#backToStart").addEventListener("click", resetToStart);
document.querySelector("#resetMediation").addEventListener("click", resetToStart);
document.querySelector("#backToForm").addEventListener("click", () => {
  result.classList.add("hidden");
  form.classList.remove("hidden");
});

document.querySelectorAll(".sample").forEach(button => {
  button.addEventListener("click", () => {
    messageInput.value = button.dataset.sample;
  });
});

function fillList(id, items) {
  const el = document.querySelector(id);
  el.innerHTML = "";
  (items || []).forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    el.appendChild(li);
  });
}

function fallbackCase(message) {
  return {
    message,
    literal: "입력한 문장의 문자 의미를 확인하는 테스트 상태입니다.",
    risks: ["현재 fixture에 없는 문장입니다. 실제 AI 연결 전에는 문화적 해석을 단정하지 않습니다."],
    facts: [],
    questions: ["상대에게 전달하려는 의도나 상황을 조금 더 설명할 수 있나요?"],
    rephrase: message,
    escalation: "none"
  };
}

function renderCase(item) {
  currentCase = item;
  document.querySelector("#literalMeaning").textContent = item.literal;
  const primaryRisk = (item.risks || [])[0] || "상황에 따라 다르게 받아들여질 수 있어 실제 의도를 확인하는 것이 좋습니다.";
  document.querySelector("#primaryRisk").textContent = primaryRisk;
  document.querySelector("#contextHint").textContent = primaryRisk;
  fillList("#factsToConfirm", item.facts);
  fillList("#questionsToConfirm", item.questions);
  document.querySelector("#factsCard").classList.toggle("hidden", !(item.facts || []).length);
  document.querySelector("#suggestedRephrase").textContent = item.rephrase;

  const notice = document.querySelector("#escalationNotice");
  if (item.escalation && item.escalation !== "none") {
    notice.textContent = item.escalation === "official_support"
      ? "이 상황은 공식 정보 또는 전문가 확인이 필요한 영역입니다."
      : "조직 규정이나 공식 기준을 함께 확인하는 것이 좋습니다.";
    notice.classList.remove("hidden");
  } else {
    notice.classList.add("hidden");
  }

  form.classList.add("hidden");
  result.classList.remove("hidden");
  feedbackStatus.textContent = "";
  actionStatus.textContent = "";
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const message = messageInput.value.trim();
  const item = cases.find(c => c.message === message) || fallbackCase(message);
  renderCase(item);
});

function speakText(text, lang = "ko-KR") {
  if (!("speechSynthesis" in window)) {
    actionStatus.textContent = "이 브라우저에서는 음성 읽기를 지원하지 않습니다.";
    return false;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
  return true;
}

document.querySelector("#speakSuggestion").addEventListener("click", () => {
  if (!currentCase) return;
  if (speakText(currentCase.rephrase)) actionStatus.textContent = "추천 표현을 읽고 있어요.";
});

document.querySelector("#copySuggestion").addEventListener("click", async () => {
  if (!currentCase) return;
  try {
    await navigator.clipboard.writeText(currentCase.rephrase);
    actionStatus.textContent = "추천 표현을 복사했습니다.";
  } catch {
    actionStatus.textContent = "복사할 수 없습니다. 문장을 길게 눌러 복사해주세요.";
  }
});

function resetPassPhone() {
  document.querySelector("#passStepHandOver").classList.remove("hidden");
  document.querySelector("#partnerView").classList.add("hidden");
  document.querySelector("#returnView").classList.add("hidden");
}
document.querySelector("#passPhoneButton").addEventListener("click", () => {
  if (!currentCase) return;
  result.classList.add("hidden");
  resetPassPhone();
  passPhonePanel.classList.remove("hidden");
});
document.querySelector("#cancelPassPhone").addEventListener("click", () => {
  passPhonePanel.classList.add("hidden");
  result.classList.remove("hidden");
});
document.querySelector("#showPartnerView").addEventListener("click", () => {
  document.querySelector("#passStepHandOver").classList.add("hidden");
  document.querySelector("#partnerView").classList.remove("hidden");
  document.querySelector("#partnerSentence").textContent = currentCase?.rephrase || "";
});
document.querySelector("#speakPartner").addEventListener("click", () => {
  if (currentCase) speakText(currentCase.rephrase);
});
document.querySelectorAll(".partner-response").forEach(button => {
  button.addEventListener("click", () => {
    const map = {
      understood: "상대방이 “이해했어요”라고 답했습니다.",
      different: "상대방이 “다르게 이해했어요”라고 답했습니다. 뜻을 다시 확인해보세요.",
      question: "상대방에게 질문이 있습니다. 직접 질문을 들어보세요."
    };
    sessionStorage.setItem("safecircle:partner-response", JSON.stringify({
      response: button.dataset.response,
      created_at: new Date().toISOString()
    }));
    document.querySelector("#partnerView").classList.add("hidden");
    document.querySelector("#returnView").classList.remove("hidden");
    document.querySelector("#partnerResponseSummary").textContent = map[button.dataset.response];
  });
});
document.querySelector("#finishPassPhone").addEventListener("click", () => {
  passPhonePanel.classList.add("hidden");
  result.classList.remove("hidden");
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const voiceButton = document.querySelector("#voiceInputButton");
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "ko-KR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  voiceButton.addEventListener("click", () => {
    document.querySelector("#voiceInputText").textContent = "듣고 있어요…";
    recognition.start();
  });
  recognition.addEventListener("result", event => {
    messageInput.value = event.results[0][0].transcript;
  });
  recognition.addEventListener("end", () => {
    document.querySelector("#voiceInputText").textContent = "말로 입력하기";
  });
  recognition.addEventListener("error", () => {
    document.querySelector("#voiceInputText").textContent = "말로 입력하기";
    document.querySelector("#voiceSupportNote").textContent = "음성입력을 사용할 수 없어 글 입력으로 계속할 수 있습니다.";
  });
} else {
  voiceButton.disabled = true;
  voiceButton.setAttribute("aria-disabled", "true");
  document.querySelector("#voiceInputText").textContent = "음성입력 미지원 · 글로 입력";
}

document.querySelectorAll(".feedback").forEach(button => {
  button.addEventListener("click", () => {
    const eventData = {
      mediation_mode: mode,
      relationship: document.querySelector("#relationship").value,
      domain: document.querySelector("#domain").value,
      intent_match: button.dataset.value,
      message_fingerprint: String(messageInput.value.trim().length),
      created_at: new Date().toISOString(),
      consent_for_aggregate_learning: true
    };
    sessionStorage.setItem("safecircle:last-feedback", JSON.stringify(eventData));
    feedbackStatus.textContent = "피드백이 저장되었습니다. 개인 평가에는 사용하지 않습니다.";
  });
});

fetch("./fixtures/mediation-cases.json")
  .then(r => r.json())
  .then(data => { cases = data.cases || []; })
  .catch(() => { cases = []; });

fetch("./fixtures/context-patterns.json")
  .then(r => r.json())
  .then(data => {
    const pattern = (data.patterns || [])[0];
    if (!pattern) return;
    document.querySelector("#patternTitle").textContent = "반복되는 커뮤니케이션 마찰";
    document.querySelector("#patternText").textContent = pattern.interpretation;
    document.querySelector("#patternMeta").textContent =
      `개인 원문 없이 집계 · ${pattern.observations.count}건 · 상태 ${pattern.status}`;
  })
  .catch(() => {
    document.querySelector("#patternTitle").textContent = "집계 인사이트를 불러올 수 없습니다.";
  });

async function updateOfflineReadiness() {
  const el = document.querySelector("#offlineReadiness");
  if (!el) return;
  if (!("serviceWorker" in navigator) || !("caches" in window)) {
    el.textContent = "지원 안 됨";
    return;
  }
  el.textContent = "준비 중";
  try {
    await navigator.serviceWorker.ready;
    const emergencyUrl = new URL("./fixtures/emergency-bundle.json", window.location.href).href;
    const cached = await caches.match(emergencyUrl);
    el.textContent = cached ? "비상정보 준비됨" : "비상정보 확인 필요";
  } catch {
    el.textContent = "비상정보 확인 필요";
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js");
      await updateOfflineReadiness();
    } catch (error) {
      console.warn("Service worker registration failed", error);
      const el = document.querySelector("#offlineReadiness");
      if (el) el.textContent = "비상정보 확인 필요";
    }
  });
} else {
  window.addEventListener("load", updateOfflineReadiness);
}