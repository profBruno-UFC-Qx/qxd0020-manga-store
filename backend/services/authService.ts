import 'dotenv/config'
import bcrypt from 'bcrypt'
import jwt, { SignOptions } from 'jsonwebtoken'
import { Repository } from 'typeorm'
import { User } from '../entities/User'
import { AppDataSource } from '../db/dataSource'

export const SECRET_KEY = process.env.SECRET_KEY as string

export class AuthService {
    private repository: Repository<User>
    constructor(){
            this.repository = AppDataSource.getRepository(User)
    }

    async isValidCredential(identifier: string, password: string) {
        const user = await this.repository.findOneBy({ email: identifier })
        if(user) {
            return bcrypt.compareSync(password , user.password)
        }
    }

    async generateAuthToken(identifier: string) {
        const user = await this.repository.findOneBy({ email: identifier })
        if(user) {
            const payload = {
                identifier: user.email,
                username: user.username,
                role: user.role
            }

            const signInOptions: SignOptions = {
                algorithm: 'HS256',
                expiresIn: '2h'
            }

            const token = jwt.sign(payload, SECRET_KEY, signInOptions)
            
            return { 
                user: {
                    id: user.id,
                    identifier: user.email,
                    username: user.username,
                    email: user.email,
                }, 
                jwt: token
            }
        }
        return { user: undefined, jwt: undefined}
    }

    async userRoles(identifier: string) {
        const user = await this.repository.findOneBy({ email: identifier })
        if(user) {
            return { 
                id: user.id,
                username: user.username,
                email: user.email,
                role: {
                    type: user.role
                } 
            }
        }
        return { user: undefined}
    }
}