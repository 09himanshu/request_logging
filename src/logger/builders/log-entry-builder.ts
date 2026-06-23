import { LoggerEntry } from "../../interfaces/log-entry.interface";

export type BuildLogEntryInput = Omit<LoggerEntry, "timestamp">;

export function buildLogEntry(
  input: BuildLogEntryInput
): LoggerEntry {
  return {
    ...input,
    timestamp: new Date(),
  };
}