type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private static instance: Logger;
  private logQueue: LogEntry[] = [];
  private readonly maxQueueSize = 100;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, metadata?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
    };
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>) {
    const logEntry = this.formatMessage(level, message, metadata);
    
    // Add to queue
    this.logQueue.push(logEntry);
    if (this.logQueue.length > this.maxQueueSize) {
      this.logQueue.shift();
    }

    // In development, also log to console
    if (__DEV__) {
      const consoleMethod = console[level] || console.log;
      consoleMethod(
        `[${logEntry.timestamp}] ${level.toUpperCase()}: ${message}`,
        metadata || ''
      );
    }
  }

  public debug(message: string, metadata?: Record<string, unknown>) {
    this.log('debug', message, metadata);
  }

  public info(message: string, metadata?: Record<string, unknown>) {
    this.log('info', message, metadata);
  }

  public warn(message: string, metadata?: Record<string, unknown>) {
    this.log('warn', message, metadata);
  }

  public error(message: string, metadata?: Record<string, unknown>) {
    this.log('error', message, metadata);
  }

  public getLogs(): LogEntry[] {
    return [...this.logQueue];
  }

  public clearLogs() {
    this.logQueue = [];
  }
}

export const logger = Logger.getInstance();
