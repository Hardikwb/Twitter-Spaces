class APIError extends Error {
  statusCode: number;
  errors: Error[];
  success: boolean = false;

  constructor(
    statusCode: number = 500,
    message: string = "Something went wrong",
    errors: Error[] = [],
  ) {
    super(message);
    this.name = "APIError";
    this.success = false;
    this.statusCode = statusCode;
    this.errors = errors;

    Object.setPrototypeOf(this, APIError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export { APIError };
