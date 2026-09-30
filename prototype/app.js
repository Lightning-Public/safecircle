const views = [...document.querySelectorAll(".view")];
const navItems = [...document.querySelectorAll(".nav-item")];
const networkBadge = document.querySelector("#networkBadge");
const appMain = document.querySelector("#appMain");
const form = document.querySelector("#mediationForm");
const result = document.querySelector("#mediationResult");
const start = document.querySelector("#helpStart");
const messageInput = document.querySelector("#message");
const feedbackStatus = document.querySelector("#feedbackStatus");
let mode = "before_send";
let cases = [];

function setView(target) {
  views.forEach(v => v.classList.toggle("active", v.dataset.view === target));
  navItems.forEach(n => n.classList.toggle("active", n.dataset.target === target));
  appMain.focus({ preventScroll: true });
}
navItems.forEach(item => item.addEventListener("click", () => setView(item.dataset.target)));

function updateNetworkState() {
  const online = navigator.onLine;
  networkBadge.textContent = online ? "온라인" : "오프라인";
  networkBadge.classList.toggle("offline", !online);
}
window.addEventListener("online", updateNetworkState);
window.addEventListener("offline", updateNetworkState);
updateNetworkState();

document.querySelectorAll(".mode-button").forEach(button => {
  button.addEventListener("click", () => {
    mode = button.dataset.mode;
    start.classList.add("hidden");
    form.classList.remove("hidden");
    messageInput.focus();
  });
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
    risks: ["현재 fixture에 없는 문장입니다. 실제 AI 연결 전에는 해석을 단정하지 않습니다."],
    facts: [],
    questions: ["상대에게 전달하려는 의도나 상황을 조금 더 설명할 수 있나요?"],
    rephrase: message,
    escalation: "none"
  };
}

function renderCase(item) {
  document.querySelector("#literalMeaning").textContent = item.literal;
  fillList("#interpretationRisks", item.risks);
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
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const message = messageInput.value.trim();
  const item = cases.find(c => c.message === message) || fallbackCase(message);
  renderCase(item);
});

document.querySelectorAll(".feedback").forEach(button => {
  button.addEventListener("click", () => {
    const eventData = {
      mediation_mode: mode,
      intent_match: button.dataset.value,
      created_at: new Date().toISOString()
    };
    sessionStorage.setItem("safecircle:last-feedback", JSON.stringify(eventData));
    feedbackStatus.textContent = "피드백이 저장되었습니다. 개인 평가에는 사용하지 않습니다.";
  });
});

document.querySelector("#resetMediation").addEventListener("click", () => {
  result.classList.add("hidden");
  start.classList.remove("hidden");
  messageInput.value = "";
});

fetch("./fixtures/mediation-cases.json")
  .then(r => r.json())
  .then(data => { cases = data.cases || []; })
  .catch(() => { cases = []; });

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js");
    } catch (error) {
      console.warn("Service worker registration failed", error);
    }
  });
}