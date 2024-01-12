export abstract class CustomError extends Error {
  abstract statusCode: number;
  constructor(message: string) {
    super(message);
    // Only because we are extending a build in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  // subclass must have an serializeErros method that returns array of objects with message
  abstract serializeErrors(): { message: string; field?: string }[];
}
