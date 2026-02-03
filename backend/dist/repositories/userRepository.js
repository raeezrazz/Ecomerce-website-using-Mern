"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_1 = require("../models/user");
// src/repositories/userRepository.ts
const inversify_1 = require("inversify");
let UserRepository = class UserRepository {
    async createUser(data) {
        const user = new user_1.User(data);
        await user.save();
        return user;
    }
    async findByEmail(email) {
        const user = await user_1.User.findOne({ email }).lean();
        return user;
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, inversify_1.injectable)()
], UserRepository);
