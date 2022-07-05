import express from 'express'
import { expressjwt, Request as JWTRequest } from "express-jwt"
import { SECRET_KEY, AuthService } from '../services/authService'


const authService = new AuthService();

export const router = express.Router();

router.post('/auth/local', async (req, res) => {
    const { identifier, password } = req.body
    if(await authService.isValidCredential(identifier, password)) {
        const { user, jwt } = await authService.generateAuthToken(identifier)
        if(user && jwt) {
            res.status(200).json({ user: user, jwt: jwt})
        } else {
            res.status(500).json({ error: { message: "Something bad happened. We're working on this." }})
        }
    } else {
        res.status(401).json({ error: { message: "Invalid credentials" }})
    }
})

router.get('/users/me', expressjwt({ secret: SECRET_KEY, algorithms: ["HS256"] }), async (req: JWTRequest, res) => {
    if(!req.auth?.identifier) {
        res.status(401).json({ error: { message: "Missing or invalid credentials" }})
    } else {
        const user = await authService.userRoles(req.auth.identifier)
        if(user) {
            res.status(200).json(user)
        } else {
            res.status(500).json({ error: { message: "Something bad happened. We're working on this." }})
        }
    }
    
})

