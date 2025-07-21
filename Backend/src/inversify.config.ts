import { Container } from 'inversify';
import { TYPES } from './types/types';

import { UserService } from './services/userServices';
import { UserRepository } from './repositories/userRepository';
import { OtpService } from './services/otpService';
import { OtpRepository } from './repositories/otpRepository';
import { UserController } from './controllers/userController';

const container = new Container();

container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<UserController>(TYPES.UserController).to(UserController)
container.bind<OtpService>(TYPES.OtpService).to(OtpService);
container.bind<OtpRepository>(TYPES.OtpRepository).to(OtpRepository);

export { container };
