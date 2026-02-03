"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureContainer = configureContainer;
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const userRepository_1 = require("./repositories/userRepository");
function configureContainer() {
    tsyringe_1.container.register('IUserRepository', {
        useClass: userRepository_1.UserRepository
    });
    // Register other dependencies here
}
// Call the configuration function
configureContainer();
