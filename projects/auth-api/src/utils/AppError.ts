export class AppError extends Error {
  public code: string;
  public statusCode: number;
  public errorId: string;

  constructor(
    message: string,
    code: string,
    statusCode = 400,
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.errorId = this.generateErrorId();
    Object.setPrototypeOf(this, AppError.prototype);
  }

  private generateErrorId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `ERR_${timestamp}_${random}`.toUpperCase();
  }
}