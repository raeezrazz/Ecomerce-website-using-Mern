
import mongoose , {Schema} from "mongoose"
// import {IUser} from "../interfaces/userTypes"

export type UserRole = 'user' | 'staff' | 'admin';

export interface IUser  {
    _id:string,
    name: string;
    email: string;
    password: string;
    phone: string;
    isVerified: boolean;
    role: UserRole;
    createdAt: Date;
  }
  
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  address: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  pincode: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'staff', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false  
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const User = mongoose.model<IUser>("User", UserSchema);