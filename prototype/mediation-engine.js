(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.SafeCircleMediation = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const MAX_MESSAGE_LENGTH = 500;

  const keywordGroups = {
    safety: ["안전", "기계", "화재", "대피", "감전", "가스", "위험", "사고", "보호구", "119", "멈추", "만지지"],
    workRule: ["근무", "출근", "퇴근", "휴가", "연장", "초과", "야근", "규정", "승인", "계약", "급여", "시급"],
    urgency: ["빨리", "즉시", "당장", "오늘", "내일", "반드시", "꼭", "무조건", "우선"],
    prohibition: ["안 됩니다", "안돼", "안 돼", "하지 마", "하지말", "하지 말", "금지", "못 합니다", "말고"],
    blame: ["왜", "아직", "또", "제대로", "맨날", "항상"],
    ambiguity: ["이거", "이것", "저거", "저것", "좀", "빨리", "적당히", "알아서", "나중에"],
    request: ["하세요", "해주세요", "해 주세요", "해야", "하십시오", "주세요", "나오세요", "부탁"],
    question: ["왜", "어떻게", "언제", "무엇", "어디", "가능한가", "인가요", "나요", "까요"]
  };

  function cleanMessage(value) {
    return String(value == null ? "" : value)
      .normalize("NFKC")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeMessage(value) {
    return cleanMessage(value)
      .toLowerCase()
      .replace(/[.!?…~"'“”‘’,，。！？]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function includesAny(text, keywords) {
    return keywords.some(keyword => text.includes(normalizeMessage(keyword)));
  }

  function unique(items) {
    return [...new Set(items.filter(Boolean))];
  }

  function detectSignals(message, relationship, domain) {
    const normalized = normalizeMessage(message);
    const hasQuestionMark = /[?？]/.test(message);
    const timeSpecific = /(오늘|내일|모레|다음\s*주|이번\s*주|월요일|화요일|수요일|목요일|금요일|토요일|일요일|\d+\s*(분|시간|시|일|주))/u.test(message);

    return {
      safety: domain === "safety" || includesAny(normalized, keywordGroups.safety),
      workRule: domain === "leave_schedule" || includesAny(normalized, keywordGroups.workRule),
      urgency: includesAny(normalized, keywordGroups.urgency) || timeSpecific,
      prohibition: includesAny(normalized, keywordGroups.prohibition),
      blame: includesAny(normalized, keywordGroups.blame),
      ambiguity: includesAny(normalized, keywordGroups.ambiguity),
      request: includesAny(normalized, keywordGroups.request),
      question: hasQuestionMark || includesAny(normalized, keywordGroups.question),
      hierarchy: relationship === "manager-worker",
      timeSpecific
    };
  }

  function buildLiteral(message, mode, signals) {
    if (mode === "understand_received") {
      if (signals.question) return "상대가 의사, 이유 또는 가능 여부를 확인하려는 질문으로 들립니다.";
      if (signals.prohibition) return "상대가 어떤 행동을 제한하거나 하지 말아 달라는 뜻을 전달하고 있습니다.";
      if (signals.request) return "상대가 특정 행동이나 작업을 요청하는 뜻을 전달하고 있습니다.";
      return "상대가 자신의 요청이나 상황을 전달하는 문장입니다.";
    }

    if (signals.question) return "상대의 의사, 이유 또는 가능 여부를 확인하려는 질문입니다.";
    if (signals.prohibition) return "상대에게 어떤 행동을 제한하거나 하지 말아 달라는 뜻을 전달하는 문장입니다.";
    if (signals.request) return "상대에게 특정 행동이나 작업을 요청하는 뜻을 전달하는 문장입니다.";
    return "상대에게 자신의 요청이나 상황을 전달하는 문장입니다.";
  }

  function buildRisks(signals) {
    const risks = [];

    if (signals.safety) {
      risks.push("안전과 관련된 말은 해석의 차이보다 승인된 행동절차를 정확하게 전달하는 것이 우선입니다.");
    }
    if (signals.blame) {
      risks.push("이유를 묻는 표현이 상황이나 말투에 따라 질책이나 책임 추궁처럼 들릴 수 있습니다.");
    }
    if (signals.urgency) {
      risks.push("기한이나 이유가 충분히 설명되지 않으면 재촉 또는 압박으로 받아들여질 수 있습니다.");
    }
    if (signals.prohibition) {
      risks.push("금지나 제한의 이유와 가능한 대안이 없으면 일방적인 지시처럼 느껴질 수 있습니다.");
    }
    if (signals.ambiguity) {
      risks.push("대상이나 시점이 모호한 표현이 있어 상대가 무엇을 언제까지 해야 하는지 다르게 이해할 수 있습니다.");
    }
    if (signals.hierarchy && signals.request) {
      risks.push("관리자에서 근로자로 전달되는 요청은 선택 가능한 부탁보다 의무적인 지시로 받아들여질 수 있습니다.");
    }

    if (!risks.length) {
      risks.push("문장의 뜻은 비교적 분명하지만 관계, 말투, 앞뒤 상황에 따라 의도보다 강하거나 다르게 들릴 수 있습니다.");
    }

    return unique(risks).slice(0, 3);
  }

  function buildFacts(signals) {
    const facts = [];

    if (signals.safety) {
      facts.push("현장 승인 안전수칙이나 공식 행동절차와 일치하는지 확인하세요.");
    }
    if (signals.workRule) {
      facts.push("근무시간·휴가·계약과 관련된 내용이라면 조직 규정이나 당사자 합의가 필요한지 확인하세요.");
    }
    if (signals.timeSpecific) {
      facts.push("요청한 시점이나 완료기한이 실제 일정과 맞는지 확인하세요.");
    }

    return unique(facts).slice(0, 3);
  }

  function buildQuestions(signals) {
    const questions = [];

    if (signals.blame) {
      questions.push("완료되지 않은 이유나 진행을 어렵게 하는 점이 있는지 먼저 물어볼까요?");
    }
    if (signals.urgency) {
      questions.push("언제까지 필요한지와 그 이유를 함께 설명할 수 있나요?");
    }
    if (signals.prohibition) {
      questions.push("왜 제한이 필요한지와 가능한 대안이 있는지 함께 안내할까요?");
    }
    if (signals.ambiguity) {
      questions.push("무엇을, 언제까지, 어떤 기준으로 해야 하는지 더 구체적으로 말할 수 있나요?");
    }
    if (signals.hierarchy && signals.request) {
      questions.push("상대가 어렵다고 말하거나 질문할 수 있는 여지를 함께 줄까요?");
    }

    if (!questions.length) {
      questions.push("제가 전달하려는 핵심 의도가 상대에게도 같은 뜻으로 들렸는지 확인해볼까요?");
    }

    return unique(questions).slice(0, 3);
  }

  function buildRephrase(message, signals) {
    if (signals.safety && signals.question) {
      return `안전과 관련된 내용이라 임의로 판단하지 않겠습니다. “${message}”는 현장 승인 안전수칙이나 관리자에게 먼저 확인해주세요.`;
    }
    if (signals.safety) {
      return `안전을 위해 “${message}”를 우선 지켜주세요. 현장 승인 절차와 다른 점이 있으면 즉시 관리자에게 확인해주세요.`;
    }
    if (signals.blame) {
      return "현재 진행 상황을 확인하고 싶습니다. 어려운 점이나 필요한 도움이 있으면 알려주세요. 완료 가능한 시점도 함께 확인해볼까요?";
    }
    if (signals.prohibition) {
      return `“${message}”라고 말씀드리는 이유와 가능한 대안을 함께 설명드리겠습니다. 어려운 점이 있으면 말씀해주세요.`;
    }
    if (signals.urgency || signals.request) {
      return `요청드릴 내용이 있습니다. “${message}” 가능한지 확인해주세요. 어렵거나 확인할 부분이 있으면 함께 조정하겠습니다.`;
    }
    if (signals.question) {
      return `“${message}”라고 확인하고 싶습니다. 사실이나 의사를 편하게 알려주세요.`;
    }
    return `제가 전하려는 내용은 “${message}”입니다. 제가 의도한 뜻과 다르게 들린 부분이 있으면 말씀해주세요.`;
  }

  function analyzeMessage(input) {
    input = input || {};
    const message = cleanMessage(input.message);

    if (!message) {
      const error = new Error("message is required");
      error.code = "MESSAGE_REQUIRED";
      throw error;
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      const error = new Error("message is too long");
      error.code = "MESSAGE_TOO_LONG";
      throw error;
    }

    const mode = input.mode || "before_send";
    const relationship = input.relationship || "peer-peer";
    const domain = input.domain || "workplace_instruction";
    const signals = detectSignals(message, relationship, domain);

    const escalation = signals.safety
      ? "official_support"
      : signals.workRule
        ? "official_or_org_rule"
        : "none";

    return {
      schema_version: "1.0",
      engine: "rule-v1",
      message,
      literal: buildLiteral(message, mode, signals),
      risks: buildRisks(signals),
      facts: buildFacts(signals),
      questions: buildQuestions(signals),
      rephrase: buildRephrase(message, signals),
      escalation,
      signals: Object.keys(signals).filter(key => signals[key] === true)
    };
  }

  function validateResult(result) {
    return Boolean(
      result &&
      result.schema_version === "1.0" &&
      typeof result.message === "string" &&
      typeof result.literal === "string" &&
      Array.isArray(result.risks) &&
      Array.isArray(result.facts) &&
      Array.isArray(result.questions) &&
      typeof result.rephrase === "string" &&
      typeof result.escalation === "string"
    );
  }

  return {
    MAX_MESSAGE_LENGTH,
    cleanMessage,
    normalizeMessage,
    analyzeMessage,
    validateResult
  };
});
