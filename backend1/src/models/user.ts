
import mongoose , {Schema} from "mongoose"
// import {IUser} from "../interfaces/userTypes"

export interface IUser  {
    _id:string,
    name: string;
    email: string;
    password: string;
    phone: string;
    isVerified: boolean;
    isAdmin: boolean;
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
  isAdmin: {
    type: Boolean,
    default: false
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