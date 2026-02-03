"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES = void 0;
// src/types.ts
const TYPES = {
    UserService: Symbol.for('UserService'),
    OtpService: Symbol.for("OtpService"),
    UserRepository: Symbol.for('UserRepository'),
    OtpRepository: Symbol.for('OtpRepository'),
    UserController: Symbol.for('UserController')
};
exports.TYPES = TYPES;
