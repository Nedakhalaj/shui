import jwt from "jsonwebtoken";


export function signToken(username){
    return jwt.sign({username}, process.env.JWT_SECRET, {expiresIn: "1h" })
}

export function verifyToken(token){
    return jwt.verify(token, process.env.JWT_SECRET)
}