// src/inversify.config.ts
import { Container } from 'inversify';
import { UserService } from './services/userServices';
import { UserRepository } from './repositories/userRepository';
import { TYPES } from './types/types';

const container = new Container();

container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

export { container };