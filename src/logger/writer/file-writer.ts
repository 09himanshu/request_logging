import fs from "fs";
import path from "path";

import { LoggerEntry } from "../../interfaces/log-entry.interface";

export class FileWriter {
  private stream!: fs.WriteStream;
  private currentDate: string;

  constructor() {
    this.currentDate = this.getCurrentDate();
    this.createStream(this.currentDate);
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split("T")[0] ?? "";
  }

  private createStream(date: string): void {
    const logsDir = path.join(process.cwd(), "logs");

    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const filePath = path.join(
      logsDir,
      `request-log-${date}.jsonl`
    );

    this.stream = fs.createWriteStream(filePath, {
      flags: "a",
    });

    this.stream.on("error", (error) => {
      console.error("Logger stream error:", error);
    });
  }

  public rotateIfNeeded(): string | null {
    const today = this.getCurrentDate();

    if (today === this.currentDate) {
      return null;
    }

    const rotatedDate = this.currentDate;

    this.stream.end();

    this.currentDate = today;

    this.createStream(today);

    return rotatedDate;
  }



  public write(logs: LoggerEntry[]): void {
    const payload = logs
      .map((log) => JSON.stringify(log))
      .join("\n");

    this.stream.write(payload + "\n");
  }
}