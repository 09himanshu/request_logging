import { LoggerEntry } from "../../interfaces/log-entry.interface";
import { FileWriter } from "../writer/file-writer";

export class LoggerManager {
  private buffer: LoggerEntry[] = [];

  private readonly maxBufferSize = 100;

  private readonly fileWriter: FileWriter;

  constructor() {
    this.fileWriter = new FileWriter();

    setInterval(() => {
      this.flush();
    }, 1000);
  }

  public log(entry: LoggerEntry): void {
    this.buffer.push(entry);

    if (this.buffer.length >= this.maxBufferSize) {
      this.flush();
    }
  }

  public flush(): void {
    if (this.buffer.length === 0) {
      return;
    }

    const logsToWrite = [...this.buffer];

    this.buffer = [];

    this.fileWriter.write(logsToWrite);
  }
}