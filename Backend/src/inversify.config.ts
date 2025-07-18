import { IUserController } from './controllers/userController';
// src/inversify.config.ts
import { Container } from 'inversify';
import { IUserService, UserService } from './services/userServices';
import { UserRepository, IUserRepository } from './repositories/userRepository';
import { UserController } from './controllers/userController';
import { TYPES } from './types/types';

const container = new Container();

container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<UserController>(TYPES.UserController).to(UserController);

export { container }