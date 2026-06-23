import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

import { buildLogEntry } from "../logger/builders/log-entry-builder";
import { loggerManager } from "../logger";
import {getLogLevel} from "../helper/get-log-level"

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "cardnumber",
  "cvv",
  "authorization",
  "cookie",
  "set-cookie",
  "client_secret",
]);

function redact(obj: any): any {
  if (!obj || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(redact);
  }
  const redacted: any = {};

  for (const key of Object.keys(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      redacted[key] = "[REDACTED]";
    } else if (typeof obj[key] === "object") {
      redacted[key] = redact(obj[key]);
    } else {
      redacted[key] = obj[key];
    }
  }
  return redacted;
}

function sanitizeHeaders(headers: Record<string, any>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      sanitized[key] = "[REDACTED]";
    } else {
      sanitized[key] = Array.isArray(value) ? value.join(", ") : String(value);
    }
  }
  return sanitized;
}

export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = uuidv4();
  const startTime = Date.now();

  res.on("finish", () => {
    try {
      const latencyMs = Date.now() - startTime;

      // Process request body and size
      const requestSize = req.headers["content-length"]
        ? parseInt(req.headers["content-length"] as string, 10)
        : undefined;
      const requestBody = req.body ? redact(req.body) : undefined;
      const requestHeaders = sanitizeHeaders(req.headers);

      // Process response details (no response body)
      const responseHeaders = sanitizeHeaders(res.getHeaders());
      const responseSize = res.get("content-length")
        ? parseInt(res.get("content-length") as string, 10)
        : undefined;

      const logEntry = buildLogEntry({
        requestId,
        level: getLogLevel(res.statusCode),
        method: req.method,
        route: req.route?.path || req.originalUrl,
        statusCode: res.statusCode,
        latencyMs,
        requestHeaders,
        responseHeaders,
        ...(requestSize !== undefined ? { requestSize } : {}),
        ...(responseSize !== undefined ? { responseSize } : {}),
        ...(requestBody !== undefined ? { requestBody } : {}),
        ...(req.ip ? { ip: req.ip } : {}),
      });

      loggerManager.log(logEntry);
    } catch (err) {
      console.error("[Logger Middleware Error] Failed to log request:", err);
    }
  });

  next();
}