import { CustomError } from "./custom-error";
export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = "Failed to connect to database";
  constructor() {
    super("Error connecting to database");

    // Only because we are extending a build in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
