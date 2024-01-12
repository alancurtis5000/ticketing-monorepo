"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const custom_error_1 = require("./custom-error");
class NotFoundError extends custom_error_1.CustomError {
    constructor() {
        super("Route not found");
        this.statusCode = 404;
        // Only because we are extending a build in class
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeErrors() {
        return [{ message: "Route not found" }];
    }
}
exports.NotFoundError = NotFoundError;
