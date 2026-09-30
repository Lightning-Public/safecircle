const test = require("node:test");
const assert = require("node:assert/strict");
const engine = require("../mediation-engine.js");

test("normalizes punctuation and spaces for fixture matching", () => {
  assert.equal(
    engine.normalizeMessage("  내일부터 30분 일찍 나오세요. "),
    engine.normalizeMessage("내일부터 30분 일찍 나오세요")
  );
});

test("arbitrary request returns a complete mediation result", () => {
  const result = engine.analyzeMessage({
    message: "회의 자료 오늘 안에 좀 빨리 보내주세요",
    mode: "before_send",
    relationship: "manager-worker",
    domain: "workplace_instruction"
  });

  assert.equal(engine.validateResult(result), true);
  assert.equal(result.engine, "rule-v1");
  assert.ok(result.risks.length > 0);
  assert.ok(result.questions.length > 0);
  assert.notEqual(result.rephrase, result.message);
});

test("safety content requires official confirmation", () => {
  const result = engine.analyzeMessage({
    message: "기계가 멈추면 전원을 다시 켜보세요",
    domain: "safety"
  });

  assert.equal(result.escalation, "official_support");
  assert.ok(result.facts.some(item => item.includes("안전수칙")));
  assert.ok(result.rephrase.includes("임의로 판단하지 않겠습니다"));
});

test("blaming language is surfaced as an interpretation risk", () => {
  const result = engine.analyzeMessage({
    message: "왜 아직 이것도 안 했어요?"
  });

  assert.ok(result.risks.some(item => item.includes("질책") || item.includes("책임")));
});

test("empty input is rejected", () => {
  assert.throws(
    () => engine.analyzeMessage({ message: "   " }),
    error => error && error.code === "MESSAGE_REQUIRED"
  );
});

test("ordinary questions are described without assuming blame", () => {
  const result = engine.analyzeMessage({
    message: "점심 같이 먹을래요?",
    relationship: "peer-peer"
  });

  assert.ok(result.literal.includes("의사, 이유 또는 가능 여부"));
  assert.ok(!result.rephrase.includes("진행 상황"));
});
