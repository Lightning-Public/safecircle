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
const analysisMeta = document.querySelector("#analysisMeta");
const aiProviderStatus = document.querySelector("#aiProviderStatus");
const submitButton = form.querySelector('button[type="submit"]');
let mode = "before_send";
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

async function updateAiProviderStatus() {
  if (!aiProviderStatus) return;

  if (!navigator.onLine) {
    aiProviderStatus.textContent = "오프라인 · 기본 중재 모드";
    aiProviderStatus.dataset.state = "degraded";
    return;
  }

  aiProviderStatus.textContent = "AI 연결 확인 중…";
  aiProviderStatus.dataset.state = "checking";

  try {
    const response = await fetch("./api/health", { cache: "no-store" });
    const data = await response.json();

    if (response.ok && data.configured === true) {
      aiProviderStatus.textContent = `Upstage AI 연결됨 · ${data.model || "Solar"}`;
      aiProviderStatus.dataset.state = "ready";
    } else {
      aiProviderStatus.textContent = "AI 키 미연결 · 기본 중재 모드";
      aiProviderStatus.dataset.state = "degraded";
    }
  } catch {
    aiProviderStatus.textContent = "AI 연결 확인 실패 · 기본 중재 모드";
    aiProviderStatus.dataset.state = "degraded";
  }
}

window.addEventListener("online", updateAiProviderStatus);
window.addEventListener("offline", updateAiProviderStatus);
updateAiProviderStatus();

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

async function requestMediation(message) {
  if (!window.SafeCircleMediation) {
    throw new Error("mediation engine unavailable");
  }

  const payload = {
    message,
    mode,
    relationship: document.querySelector("#relationship").value,
    domain: document.querySelector("#domain").value
  };

  if (navigator.onLine) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch("./api/mediate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      const data = await response.json();
      if (!response.ok || !window.SafeCircleMediation.validateResult(data)) {
        throw new Error(data?.message || "invalid mediation response");
      }

      return data;
    } catch (error) {
      console.warn("Mediation API fallback activated", error);
    } finally {
      window.clearTimeout(timeout);
    }
  }

  return {
    ...window.SafeCircleMediation.analyzeMessage(payload),
    transport: "local"
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

  if (analysisMeta) {
    if (item.provider === "upstage" && item.engine === "llm-v1") {
      analysisMeta.textContent = `AI 중재 · Upstage ${item.model || "Solar"}`;
      analysisMeta.dataset.state = "ai";
    } else if (item.transport === "api-fallback") {
      analysisMeta.textContent = "AI 연결 실패 · 기본 중재 모드로 처리";
      analysisMeta.dataset.state = "degraded";
    } else if (item.transport === "local") {
      analysisMeta.textContent = "오프라인 · 기본 중재 모드로 처리";
      analysisMeta.dataset.state = "degraded";
    } else {
      analysisMeta.textContent = "SafeCircle 중재";
      analysisMeta.dataset.state = "default";
    }
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;

  const previousLabel = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "이해 차이 확인 중…";

  try {
    const item = await requestMediation(message);
    renderCase(item);
  } catch (error) {
    console.error("Mediation failed", error);
    voiceSupportNote.textContent = "분석을 완료하지 못했습니다. 입력 내용을 확인한 뒤 다시 시도해주세요.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = previousLabel;
  }
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
const voiceInputText = document.querySelector("#voiceInputText");
const voiceSupportNote = document.querySelector("#voiceSupportNote");

if (SpeechRecognition && voiceButton) {
  const recognition = new SpeechRecognition();
  recognition.lang = "ko-KR";
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  let voiceActive = false;
  let voiceBaseText = "";
  let voiceTranscript = "";
  let voiceFailureText = "";

  function setVoiceActive(active) {
    voiceActive = active;
    voiceButton.setAttribute("aria-pressed", active ? "true" : "false");
    voiceInputText.textContent = active ? "듣기 중지" : "말로 입력하기";
  }

  function applyVoiceTranscript(transcript) {
    const normalized = transcript.replace(/\s+/g, " ").trim();
    if (!normalized) return;
    voiceTranscript = normalized;
    messageInput.value = [voiceBaseText, normalized].filter(Boolean).join(" ");
    messageInput.dispatchEvent(new Event("input", { bubbles: true }));
  }

  voiceButton.addEventListener("click", () => {
    if (voiceActive) {
      recognition.stop();
      return;
    }

    voiceBaseText = messageInput.value.trim();
    voiceTranscript = "";
    voiceFailureText = "";
    voiceSupportNote.textContent = "마이크 권한을 허용한 뒤 자연스럽게 말해주세요.";

    try {
      recognition.start();
    } catch (error) {
      setVoiceActive(false);
      voiceSupportNote.textContent = "음성입력을 시작하지 못했습니다. 잠시 후 다시 시도하거나 글로 입력해주세요.";
      console.warn("Speech recognition start failed", error);
    }
  });

  recognition.addEventListener("start", () => {
    setVoiceActive(true);
    voiceSupportNote.textContent = "듣고 있어요. 말한 내용은 아래 입력란에 바로 표시됩니다.";
  });

  recognition.addEventListener("result", event => {
    const finalParts = [];
    const interimParts = [];

    for (let i = 0; i < event.results.length; i += 1) {
      const result = event.results[i];
      const transcript = result?.[0]?.transcript?.trim();
      if (!transcript) continue;
      (result.isFinal ? finalParts : interimParts).push(transcript);
    }

    const combined = [...finalParts, ...interimParts].join(" ");
    applyVoiceTranscript(combined);

    if (finalParts.length) {
      voiceSupportNote.textContent = "음성 내용이 글 입력란에 반영되었습니다. 필요하면 문장을 수정한 뒤 확인하세요.";
    }
  });

  recognition.addEventListener("nomatch", () => {
    voiceSupportNote.textContent = "말을 정확히 인식하지 못했습니다. 다시 시도하거나 글로 입력해주세요.";
  });

  recognition.addEventListener("error", event => {
    if (event.error === "aborted") return;

    const errorMessages = {
      "not-allowed": "마이크 권한이 허용되지 않았습니다. 브라우저 설정에서 마이크를 허용하거나 글로 입력해주세요.",
      "service-not-allowed": "이 브라우저에서는 음성인식 서비스를 사용할 수 없습니다. 글로 입력해주세요.",
      "audio-capture": "마이크를 사용할 수 없습니다. 기기의 마이크 상태를 확인하거나 글로 입력해주세요.",
      "no-speech": "음성이 감지되지 않았습니다. 다시 시도하거나 글로 입력해주세요.",
      "network": "음성인식 연결에 문제가 있습니다. 네트워크를 확인하거나 글로 입력해주세요."
    };

    voiceFailureText = errorMessages[event.error] || "음성입력을 사용할 수 없습니다. 글 입력으로 계속할 수 있습니다.";
    voiceSupportNote.textContent = voiceFailureText;
  });

  recognition.addEventListener("end", () => {
    setVoiceActive(false);

    if (voiceFailureText) return;
    if (voiceTranscript) {
      voiceSupportNote.textContent = "음성 내용이 글 입력란에 반영되었습니다. 필요하면 문장을 수정한 뒤 확인하세요.";
    } else {
      voiceSupportNote.textContent = "인식된 내용이 없습니다. 다시 말하거나 글로 입력해주세요.";
    }
  });
} else if (voiceButton) {
  voiceButton.disabled = true;
  voiceButton.setAttribute("aria-disabled", "true");
  voiceInputText.textContent = "음성입력 미지원 · 글로 입력";
  voiceSupportNote.textContent = "이 브라우저는 음성입력을 지원하지 않습니다. 아래 글 입력란을 이용해주세요.";
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