export class ConflictError extends Error {
    statusCode: number;
  
    constructor(message: string) {
      super(message);
      this.name = "ConflictError"; // Helps in debugging
      this.statusCode = 409; // HTTP 409 Conflict
    }
  }