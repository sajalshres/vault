/**
 * @module APIError
 * https://javascript.info/custom-errors
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */

const httpStatus = require('http-status');

/**
 * @extends Error
 */
class ExtendableError extends Error {
  constructor({ message, errors, status, isPublic, stack }) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true;
    this.stack = stack;
  }
}

/**
 * Represents API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  constructor({
    message,
    errors,
    stack,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic = false,
  }) {
    super({ message, errors, status, isPublic, stack });
  }
}

module.exports = APIError;
