import fs from "fs";
import path from "path";

import { LoggerEntry } from "../../interfaces/log-entry.interface";

export class FileWriter {
  private stream: fs.WriteStream | null = null;
  private currentFileDate: string = "";

  constructor() {
    this.ensureStreamForDate();
  }

  private ensureStreamForDate(): void {
    const todayDate = new Date().toISOString().split("T")[0] || "";
    if (this.currentFileDate === todayDate && this.stream) {
      return;
    }

    if (this.stream) {
      this.stream.end();
    }

    const logsDir = path.join(process.cwd(), "logs");

    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const fileName = `request-log-${todayDate}.jsonl`;
    const filePath = path.join(logsDir, fileName);

    this.currentFileDate = todayDate;
    this.stream = fs.createWriteStream(filePath, {
      flags: "a",
    });
  }

  public write(logs: LoggerEntry[]): void {
    this.ensureStreamForDate();
    const payload = logs
      .map((log) => JSON.stringify(log))
      .join("\n");

    if (this.stream) {
      this.stream.write(payload + "\n");
    }
  }

  public getActiveFileName(): string {
    return `request-log-${this.currentFileDate}.jsonl`;
  }
}