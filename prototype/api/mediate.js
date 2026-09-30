const {
  analyzeMessage,
  validateResult
} = require("../mediation-engine.js");
const {
  mediateWithUpstage
} = require("../providers/upstage.js");

module.exports = async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({
      error: "method_not_allowed",
      message: "POST 요청만 지원합니다."
    });
  }

  let body;
  try {
    body = typeof request.body === "string"
      ? JSON.parse(request.body || "{}")
      : (request.body || {});
  } catch {
    return response.status(400).json({
      error: "invalid_json",
      message: "요청 형식을 확인해주세요."
    });
  }

  let input;
  try {
    const localValidation = analyzeMessage({
      message: body.message,
      mode: body.mode,
      relationship: body.relationship,
      domain: body.domain
    });

    input = {
      message: localValidation.message,
      mode: body.mode || "before_send",
      relationship: body.relationship || "peer-peer",
      domain: body.domain || "workplace_instruction"
    };
  } catch (error) {
    return response.status(400).json({
      error: error && error.code ? error.code.toLowerCase() : "invalid_input",
      message: "입력 문장을 확인해주세요."
    });
  }

  try {
    const aiResult = await mediateWithUpstage(input);

    if (!validateResult(aiResult)) {
      throw Object.assign(new Error("invalid AI mediation result"), {
        code: "INVALID_AI_RESULT"
      });
    }

    return response.status(200).json(aiResult);
  } catch (error) {
    const fallback = analyzeMessage(input);

    return response.status(200).json({
      ...fallback,
      transport: "api-fallback",
      degraded: true,
      fallback_reason: error && error.code ? error.code : "UPSTAGE_UNKNOWN_ERROR"
    });
  }
};
