import jwt from 'jsonwebtoken'

const SECRET_KEY =process.env.JWT_SECRET

export const generateToken =(payload:object):String=>{
   return jwt.sign(payload, SECRET_KEY, {expiresIn:'2d'})
}

export const verifyToken = (token:string):any=>{
    return jwt.verify(token, SECRET_KEY)
}
