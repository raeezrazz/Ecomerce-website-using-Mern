import { injectable } from "tsyringe";
import { User } from "../models/user";


// @injectable()
export class UserRepository {
  async createUser(data: any): Promise<any> {
    console.log("create user reached",data)
    const user = new User(data)
    user.save()
    return user;
  }

  async findByEmail(email: string): Promise<Document | null> {
    return await User.findOne({ email });
  }

}
