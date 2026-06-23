# Request Logging System

A production-style request logging and archival system built with Node.js, TypeScript, Express, Streams, and Child Processes.

The system captures every API request lifecycle, stores structured logs in JSONL format, rotates log files daily, compresses archived logs using Gzip, and prepares them for long-term storage in Amazon S3.

## Features

- Request lifecycle tracking
- Structured JSON logging
- Request latency measurement
- Request ID generation
- Daily log file rotation
- Buffered logging for improved performance
- Stream-based file writing
- Graceful shutdown support
- Log levels (INFO, WARN, ERROR)
- Child-process based log compression
- JSONL (JSON Lines) format
- S3 archival support (In Progress)

---

## Architecture

```text
Request
   │
   ▼
Middleware
   │
   ▼
Log Entry Builder
   │
   ▼
Logger Manager
   │
   ▼
Memory Buffer
   │
   ▼
File Writer (WriteStream)
   │
   ▼
request-log-YYYY-MM-DD.jsonl
   │
   ▼
Daily Rotation
   │
   ▼
Compression Worker (gzip)
   │
   ▼
request-log-YYYY-MM-DD.jsonl.gz
   │
   ▼
Amazon S3 (Planned)
```

---

## Log Lifecycle

### Active Log File

```text
logs/
└── request-log-2026-06-23.jsonl
```

### After Rotation

```text
logs/
├── request-log-2026-06-24.jsonl
└── compressed/
    └── request-log-2026-06-23.jsonl.gz
```

---

## Log Structure

```json
{
  "requestId": "4d4dba64-f0e3-42e7-a2c4-6fbb2f9a1d12",
  "timestamp": "2026-06-23T18:22:17.000Z",
  "level": "INFO",
  "method": "GET",
  "route": "/health",
  "statusCode": 200,
  "latencyMs": 12,
  "ip": "::1"
}
```

---

## Log Levels

| Status Code | Log Level |
|------------|------------|
| 2xx, 3xx | INFO |
| 4xx | WARN |
| 5xx | ERROR |

---

## Project Structure

```text
src
├── interfaces
│   └── log-entry.interface.ts
│
├── middleware
│   └── request-logger.middleware.ts
│
├── logger
│   ├── builders
│   │   └── log-entry-builder.ts
│   │
│   ├── manager
│   │   └── logger-manager.ts
│   │
│   ├── writers
│   │   └── file-writer.ts
│   │
│   ├── workers
│   │   └── compression-worker.ts
│   │
│   └── helpers
│       └── get-log-level.ts
│
└── server.ts
```

---

## Why JSONL?

JSON Lines format is preferred for logging systems because:

- Easy append operations
- Streaming friendly
- ELK/OpenSearch compatible
- Better crash recovery
- Memory efficient

Example:

```json
{"requestId":"1","statusCode":200}
{"requestId":"2","statusCode":500}
{"requestId":"3","statusCode":404}
```

---

## Why Streams?

Instead of using `appendFile()` for every request, the project uses a persistent `WriteStream`.

Benefits:

- Reduced file open/close operations
- Better performance
- Lower memory usage
- Suitable for high-traffic systems

---

## Why Buffered Logging?

Writing directly to disk on every request can become expensive.

The logger buffers entries in memory and periodically flushes them to disk.

```text
Requests
   │
   ▼
Memory Buffer
   │
   ▼
Batch Flush
   │
   ▼
WriteStream
```

Benefits:

- Fewer disk writes
- Improved throughput
- Reduced I/O overhead

---

## Why Child Process Compression?

Archived log files are compressed using the operating system's `gzip` utility through Node.js child processes.

```text
Rotated File
     │
     ▼
spawn("gzip")
     │
     ▼
Compressed Archive
```

Benefits:

- Work isolated from the main application process
- Better fault isolation
- Suitable for large log files
- Easier future scaling

---

## Graceful Shutdown

Before application shutdown:

- Flushes pending log entries
- Closes streams safely
- Prevents log loss

Handled signals:

```text
SIGINT
SIGTERM
```

---

## Future Enhancements

### S3 Archival

```text
Compressed Log
      │
      ▼
Amazon S3
```

### Retention Policy

- Automatic cleanup of local archives
- Configurable retention period

### Retry Mechanism

- Upload retry support
- Failed upload recovery

### Trace IDs

- Distributed tracing support
- Microservice observability

### Request & Response Size Tracking

- Request payload size
- Response payload size

### Backpressure Handling

- Stream backpressure support
- High throughput optimization

---

## Running Locally

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Generate test requests:

```bash
curl http://localhost:3000/health
```

View logs:

```bash
cat logs/request-log-$(date +%F).jsonl
```

---

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Node Streams
- Child Processes
- Gzip
- AWS S3 (Planned)

---

## Learning Outcomes

This project demonstrates:

- TypeScript Interfaces
- Utility Types
- Middleware Design
- Stream Processing
- File Rotation
- Child Processes
- Structured Logging
- Background Job Execution
- System Design Fundamentals
- Production Logging Architecture

---

## License

MIT