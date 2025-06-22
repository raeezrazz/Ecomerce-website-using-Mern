import "reflect-metadata";
import { container } from 'tsyringe';
import { UserRepository } from "./repositories/userRepository";
import { UserService } from "./services/userServices";

export function configureContainer() {
    container.register('IUserRepository', {
        useClass: UserRepository
    });
    
    // Register other dependencies here
}

// Call the configuration function
configureContainer();