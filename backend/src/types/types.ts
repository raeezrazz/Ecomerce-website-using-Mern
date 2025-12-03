// src/types.ts
const TYPES = {
    UserService: Symbol.for('UserService'),
    OtpService:  Symbol.for("OtpService"),
    UserRepository: Symbol.for('UserRepository'),
    OtpRepository: Symbol.for('OtpRepository'),
    UserController: Symbol.for('UserController')
  };
  
  export { TYPES };