import logModel from "../db/models/log.models.js";

export async function logReqResDocument(req, res, next) {
  // Save the original res.end function
  const originalEnd = res.end;

  // Override res.end
  res.end = async function (...args) {
    try {
      // Log request and response details
      const currentLog = await logModel.create({
        ip: req.ip,
        path: req.originalUrl,
        method: req.method,
        status_code: res.statusCode,
        original_IP: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      });
      // console.log("Log created:", currentLog);
    } catch (error) {
      // console.error("Error logging request/response:", error);
    }

    // Call the original res.end to finalize the response
    originalEnd.apply(res, args);
  };

  // Call the next middleware
  next();
}
