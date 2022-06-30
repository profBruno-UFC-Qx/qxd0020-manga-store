import express from 'express'
import { expressjwt, Request as JWTRequest } from "express-jwt"
import { SECRET_KEY, AuthService } from '../services/authService'


const authService = new AuthService();

export const router = express.Router();

router.post('/auth/local', (req, res) => {
    const { identifier, password } = req.body
    if(authService.isValidCredential(identifier, password)) {
        const { user, jwt } = authService.generateAuthToken(identifier)
        if( user && jwt) {
            res.status(200).json({ user: user, jwt: jwt})
        } else {
            res.status(500).json({ error: { message: "Something bad happened. We're working on this." }})
        }
    } else {
        res.status(401).json({ error: { message: "Invalid credentials" }})
    }
})


