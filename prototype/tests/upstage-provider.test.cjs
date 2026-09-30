const test = require("node:test");
const assert = require("node:assert/strict");
const {
  mediateWithUpstage,
  RESULT_SCHEMA,
  DEFAULT_MODEL
} = require("../providers/upstage.js");

test("structured output schema is strict and complete", () => {
  assert.equal(RESULT_SCHEMA.additionalProperties, false);
  assert.deepEqual(
    RESULT_SCHEMA.required,
    ["literal", "risks", "facts", "questions", "rephrase", "escalation"]
  );
  assert.equal(DEFAULT_MODEL, "solar-pro4");
});

test("Upstage adapter sends bearer auth and parses structured mediation", async () => {
  let captured;
  const fetchImpl = async (url, options) => {
    captured = { url, options };
    return {
      ok: true,
      status: 200,
      async json() {
        return {
          model: "solar-pro4-260806",
          choices: [{
            message: {
              content: JSON.stringify({
                literal: "오늘 안에 회의 자료를 보내달라는 요청입니다.",
                risks: ["이유 없이 급하게 요청하면 압박으로 들릴 수 있습니다."],
                facts: ["실제 마감 시점을 확인하세요."],
                questions: ["오늘 몇 시까지 필요한가요?"],
                rephrase: "회의 자료가 오늘 필요합니다. 가능하면 몇 시까지 전달 가능한지 알려주세요.",
                escalation: "none"
              })
            }
          }]
        };
      }
    };
  };

  const result = await mediateWithUpstage({
    message: "회의 자료 오늘 안에 빨리 보내주세요",
    mode: "before_send",
    relationship: "manager-worker",
    domain: "workplace_instruction"
  }, {
    apiKey: "test-key",
    fetchImpl
  });

  assert.equal(captured.url, "https://api.upstage.ai/v1/chat/completions");
  assert.equal(captured.options.headers.Authorization, "Bearer test-key");

  const body = JSON.parse(captured.options.body);
  assert.equal(body.model, "solar-pro4");
  assert.equal(body.response_format.type, "json_schema");
  assert.equal(body.response_format.json_schema.strict, true);

  assert.equal(result.provider, "upstage");
  assert.equal(result.engine, "llm-v1");
  assert.equal(result.model, "solar-pro4-260806");
  assert.equal(result.transport, "api");
  assert.equal(result.escalation, "none");
});

test("missing API key fails closed to caller fallback", async () => {
  await assert.rejects(
    () => mediateWithUpstage({ message: "안녕하세요" }, { apiKey: "" }),
    error => error && error.code === "UPSTAGE_NOT_CONFIGURED"
  );
});
