import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export class CompressionWorker {
  public compress(
    filePath: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const compressedDir = path.join(
        process.cwd(),
        "compressed"
      );

      if (!fs.existsSync(compressedDir)) {
        fs.mkdirSync(compressedDir, {
          recursive: true,
        });
      }

      const fileName = path.basename(filePath);

      const gzFilePath = path.join(
        compressedDir,
        `${fileName}.gz`
      );

      console.log("Compression Started");
      const gzipProcess = spawn("gzip", [
        "-c",
        filePath,
      ]);

      const output =
        fs.createWriteStream(gzFilePath);

      gzipProcess.stdout.pipe(output);

      gzipProcess.on("close", (code) => {
        if (code === 0) {
          resolve(gzFilePath);
        } else {
          reject(
            new Error(
              `Compression failed with code ${code}`
            )
          );
        }
      });

      gzipProcess.on("error", reject);
    });
  }
}