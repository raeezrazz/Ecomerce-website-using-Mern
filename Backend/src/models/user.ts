
import mongoose , {Schema} from "mongoose"
// import {IUser} from "../interfaces/userTypes"


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
        type:Number,
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