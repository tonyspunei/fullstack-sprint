interface LogContext {
  requestId?: string;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
}

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: LogContext;
  meta?: Record<string, any>;
}

class Logger {
  private sanitizeEmail(email: string): string {
    const [user, domain] = email.split('@');
    return `${user.substring(0, 2)}***@${domain}`;
  }

  private sanitizeIp(ip: string): string {
    const parts = ip.split('.');
    return `${parts[0]}.${parts[1]}.***.**`;
  }

  private createLogEntry(
    level: LogEntry['level'],
    message: string,
    context?: LogContext,
    meta?: Record<string, any>
  ): LogEntry {
    const sanitizedContext: LogContext = {};
    
    if (context?.requestId) sanitizedContext.requestId = context.requestId;
    if (context?.userId) sanitizedContext.userId = context.userId;
    if (context?.email) sanitizedContext.email = this.sanitizeEmail(context.email);
    if (context?.ip) sanitizedContext.ip = this.sanitizeIp(context.ip);
    if (context?.userAgent) sanitizedContext.userAgent = context.userAgent?.substring(0, 50);

    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: Object.keys(sanitizedContext).length > 0 ? sanitizedContext : undefined,
      meta
    };
  }

  private output(entry: LogEntry): void {
    const logString = JSON.stringify(entry);
    
    switch (entry.level) {
      case 'error':
        console.error(logString);
        break;
      case 'warn':
        console.warn(logString);
        break;
      case 'debug':
        if (process.env.NODE_ENV === 'development') {
          console.debug(logString);
        }
        break;
      default:
        console.log(logString);
    }
  }

  info(message: string, context?: LogContext, meta?: Record<string, any>): void {
    this.output(this.createLogEntry('info', message, context, meta));
  }

  warn(message: string, context?: LogContext, meta?: Record<string, any>): void {
    this.output(this.createLogEntry('warn', message, context, meta));
  }

  error(message: string, context?: LogContext, meta?: Record<string, any>): void {
    this.output(this.createLogEntry('error', message, context, meta));
  }

  debug(message: string, context?: LogContext, meta?: Record<string, any>): void {
    this.output(this.createLogEntry('debug', message, context, meta));
  }
}

export const logger = new Logger(); 