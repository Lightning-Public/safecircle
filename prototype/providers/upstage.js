const UPSTAGE_CHAT_URL = "https://api.upstage.ai/v1/chat/completions";
const DEFAULT_MODEL = "solar-pro4";

const RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["literal", "risks", "facts", "questions", "rephrase", "escalation"],
  properties: {
    literal: {
      type: "string",
      description: "사용자가 말한 문장의 직접적인 의도 또는 문자적 의미를 한국어 한두 문장으로 설명"
    },
    risks: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: { type: "string" },
      description: "상대가 다르게 받아들일 수 있는 지점. 문화나 국적을 단정하지 말고 관계·상황·표현을 근거로 작성"
    },
    facts: {
      type: "array",
      maxItems: 3,
      items: { type: "string" },
      description: "추가 확인이 필요한 사실 또는 공식 기준. 없으면 빈 배열"
    },
    questions: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: { type: "string" },
      description: "서로의 뜻을 확인하기 위한 중립적인 확인 질문"
    },
    rephrase: {
      type: "string",
      description: "원래 의도를 유지하면서 더 명확하고 덜 오해되도록 다듬은 한국어 표현"
    },
    escalation: {
      type: "string",
      enum: ["none", "official_or_org_rule", "official_support"],
      description: "공식 규정·노동조건은 official_or_org_rule, 안전/응급/전문가 확인은 official_support"
    }
  }
};

function buildSystemPrompt() {
  return [
    "당신은 SafeCircle의 AI 중재자입니다.",
    "목표는 누가 맞는지 판정하는 것이 아니라 서로 다르게 이해될 수 있는 지점을 찾아 대화를 돕는 것입니다.",
    "사용자의 국적, 문화, 성격, 의도를 근거 없이 추정하거나 고정관념으로 설명하지 마세요.",
    "사실과 가능한 해석을 분리하세요.",
    "안전, 노동조건, 조직규정, 법적 판단이 필요한 내용은 AI 답변으로 확정하지 말고 공식 기준 확인을 표시하세요.",
    "공격적이거나 비난하는 표현도 사용자의 핵심 의도를 보존하면서 중립적이고 구체적인 표현으로 바꾸세요.",
    "결과는 제공된 JSON Schema에 정확히 맞춰 한국어로 작성하세요."
  ].join("\n");
}

function buildUserPrompt(input) {
  const modeLabels = {
    before_send: "내가 전하려는 말을 보내기 전에 확인",
    understand_received: "상대에게 들은 말을 이해하기",
    together: "두 사람이 같이 확인"
  };
  const relationshipLabels = {
    "manager-worker": "관리자 → 근로자",
    "worker-manager": "근로자 → 관리자",
    "peer-peer": "동료 ↔ 동료"
  };
  const domainLabels = {
    workplace_instruction: "업무 지시/일상 업무",
    leave_schedule: "휴가·근무시간",
    safety: "안전수칙"
  };

  return [
    `사용 모드: ${modeLabels[input.mode] || input.mode || "말 전하기"}`,
    `관계: ${relationshipLabels[input.relationship] || input.relationship || "미지정"}`,
    `상황: ${domainLabels[input.domain] || input.domain || "미지정"}`,
    "사용자 문장:",
    input.message
  ].join("\n");
}

async function mediateWithUpstage(input, options = {}) {
  const apiKey = options.apiKey || process.env.UPSTAGE_API_KEY;
  const model = options.model || process.env.UPSTAGE_MODEL || DEFAULT_MODEL;
  const fetchImpl = options.fetchImpl || globalThis.fetch;

  if (!apiKey) {
    const error = new Error("UPSTAGE_API_KEY is not configured");
    error.code = "UPSTAGE_NOT_CONFIGURED";
    throw error;
  }
  if (typeof fetchImpl !== "function") {
    const error = new Error("fetch is unavailable");
    error.code = "UPSTAGE_FETCH_UNAVAILABLE";
    throw error;
  }

  const response = await fetchImpl(UPSTAGE_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: buildUserPrompt(input) }
      ],
      reasoning_effort: "low",
      temperature: 0.2,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "safecircle_mediation",
          strict: true,
          schema: RESULT_SCHEMA
        }
      }
    })
  });

  if (!response.ok) {
    const error = new Error(`Upstage request failed with status ${response.status}`);
    error.code = "UPSTAGE_HTTP_ERROR";
    error.status = response.status;
    throw error;
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (!content) {
    const error = new Error("Upstage returned no content");
    error.code = "UPSTAGE_EMPTY_RESPONSE";
    throw error;
  }

  let parsed;
  try {
    parsed = typeof content === "string" ? JSON.parse(content) : content;
  } catch {
    const error = new Error("Upstage returned invalid JSON");
    error.code = "UPSTAGE_INVALID_JSON";
    throw error;
  }

  return {
    schema_version: "1.0",
    engine: "llm-v1",
    provider: "upstage",
    model: payload?.model || model,
    message: input.message,
    literal: parsed.literal,
    risks: parsed.risks,
    facts: parsed.facts,
    questions: parsed.questions,
    rephrase: parsed.rephrase,
    escalation: parsed.escalation,
    transport: "api"
  };
}

module.exports = {
  UPSTAGE_CHAT_URL,
  DEFAULT_MODEL,
  RESULT_SCHEMA,
  buildSystemPrompt,
  buildUserPrompt,
  mediateWithUpstage
};
