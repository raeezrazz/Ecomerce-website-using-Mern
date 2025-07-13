
import mongoose , {Schema} from "mongoose"
// import {IUser} from "../interfaces/userTypes"

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    bio?: string;
    dob?: Date;
    phone?: string;
    isVerified: boolean;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
const UserSchema : Schema = new Schema({
    name :{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required: true
    },
    bio:{
        type:String,
        required:false
    },
    dob:{
        type:Date,
        required:false
    },
    phone:{
        type:String,
        required:false
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAdmin :{
        type :Boolean,
        default : false
    },
    createdAt:{type: Date},
    updatedAt: {type:Date}
})

export const User = mongoose.model<any>("User",UserSchema)
// src/models/user.ts


// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
//   createdAt: Date;
//   updatedAt: Date;
// }