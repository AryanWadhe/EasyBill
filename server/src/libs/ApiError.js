class ApiError {
  constructor(message, errors) {
    this.success = false;
    this.message = message;
    this.errors = errors;
  }
}

export default ApiError;
