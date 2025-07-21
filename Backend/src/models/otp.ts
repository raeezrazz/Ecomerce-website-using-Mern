import mongoose , {Schema} from 'mongoose'

export interface IOtp extends Document {
    _id : string ,
    email : string ,
    otp : string ,
    createdAt : Date
    
}

const OtpSchema = new mongoose.Schema({
    email : String ,
    otp : String ,
    createdAt :{
        type : Date,
        default : Date.now,
        expires : 300
    }
})
const Otp = mongoose.model('Otp', OtpSchema)
export default Otp