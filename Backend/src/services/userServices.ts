import { injectable } from 'tsyringe';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/userRepository';
import { ConflictError } from '../errors/conflictError';

@injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async registerUser(
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<Omit<User, 'password'>> {
    if (await this.userRepository.findByEmail(email)) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.createUser({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async userExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    return !!user;
  }
}