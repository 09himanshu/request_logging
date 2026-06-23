export interface LoggerEntry {
  requestId: string;
  timestamp: Date;
  method: string;
  route: string;
  statusCode: number;
  latencyMs: number;
  requestSize?: number;
  responseSize?: number;
  userId?: string;
  ip?: string;
  errorMessage?: string;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: any;
}