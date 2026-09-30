module.exports = function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "method_not_allowed" });
  }

  return response.status(200).json({
    status: "ok",
    ai_required: true,
    provider: "upstage",
    configured: Boolean(process.env.UPSTAGE_API_KEY),
    model: process.env.UPSTAGE_MODEL || "solar-pro4",
    fallback: "rule-v1"
  });
};
