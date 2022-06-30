import bcrypt from 'bcrypt'
import jwt, { SignOptions } from 'jsonwebtoken'
import 'dotenv/config'

export const SECRET_KEY = process.env.SECRET_KEY as string

interface User {
    id: number,
    username: string,
    email: string,
    password: string,
    role: string
}

interface UserDatabase {
    users: User[]
}

const userDatabase: UserDatabase  = {
    users: [
        {
            id: 1, 
            username: "Bruno", 
            email: "brunomateus@gmail.com", 
            password: "$2b$10$jYYgja.jd7AcM.tKfR0axexNBIuLMaICi7G/yl1YWLUF9VHrZ5sIG", 
            role: ""
        }
    ]
}

export class AuthService {
    constructor(){
    }

    isValidCredential(identifier: string, password: string) {
        const user = userDatabase.users.find(u => u.email === identifier)
        if(user) {
            return bcrypt.compareSync(password , user.password)
        }
    }

    generateAuthToken(identifier: string) {
        const user = userDatabase.users.find(u => u.email === identifier)
        if(user) {
            const payload = {
                id: user.email,
                username: user.username,
                role: user.role
            }

            const signInOptions: SignOptions = {
                algorithm: 'HS256',
                expiresIn: '2h'
            }

            const token = jwt.sign(payload, SECRET_KEY, signInOptions)
            
            return { user: {
                id: user.id,
                username: user.username,
                email: user.email,
            }, jwt: token}
        }
        return { user: undefined, jwt: undefined}
    }
}