const {
  analyzeMessage,
  validateResult
} = require("../mediation-engine.js");

module.exports = function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({
      error: "method_not_allowed",
      message: "POST 요청만 지원합니다."
    });
  }

  try {
    const body = typeof request.body === "string"
      ? JSON.parse(request.body || "{}")
      : (request.body || {});

    const result = analyzeMessage({
      message: body.message,
      mode: body.mode,
      relationship: body.relationship,
      domain: body.domain
    });

    if (!validateResult(result)) {
      return response.status(500).json({
        error: "invalid_mediation_result",
        message: "분석 결과 형식이 올바르지 않습니다."
      });
    }

    return response.status(200).json({
      ...result,
      transport: "api"
    });
  } catch (error) {
    const status = error && (error.code === "MESSAGE_REQUIRED" || error.code === "MESSAGE_TOO_LONG")
      ? 400
      : 500;

    return response.status(status).json({
      error: error && error.code ? error.code.toLowerCase() : "mediation_failed",
      message: status === 400
        ? "입력 문장을 확인해주세요."
        : "분석 중 문제가 발생했습니다."
    });
  }
};
