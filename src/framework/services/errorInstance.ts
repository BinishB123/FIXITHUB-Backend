class CustomError extends Error {
    statusCode: number;
    reasons: string[];
  
    constructor(message: string, statusCode: number = 500, reasons: string[] = []) {
      super(message);
      this.statusCode = statusCode;
      this.reasons = reasons;
  
     
      Object.setPrototypeOf(this, CustomError.prototype);
    }
  }

  export default CustomError
  