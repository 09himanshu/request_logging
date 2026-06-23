import express from "express";

import { requestLoggerMiddleware } from "./middleware/request-logger.middleware";
import { loggerManager } from "./logger";

const app = express();

app.use(express.json());

app.use(requestLoggerMiddleware);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
  });
});

app.get("/users/:id", (req, res) => {
  res.status(200).json({
    id: req.params.id,
  });
});

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function gracefulShutdown() {
  console.log("Flushing logs before shutdown...");

  loggerManager.flush();

  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);