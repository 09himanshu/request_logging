import { LogLevel } from "../types/log-levels.types";

export function getLogLevel(statusCode: number): LogLevel {
  if (statusCode >= 500) {
    return "ERROR";
  }

  if (statusCode >= 400) {
    return "WARN";
  }

  return "INFO";
}