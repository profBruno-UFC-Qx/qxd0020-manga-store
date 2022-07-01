import { NextFunction, Response } from "express";
import { Request as JWTRequest } from "express-jwt"

export function authorizathonHandler(err: Error, req: JWTRequest, res: Response, next: NextFunction) {
    if (err.name === "UnauthorizedError") {
      res.status(401).json({ error: { message: "Missing or invalid credentials"}});
    } else {
      next(err);
    }
  }

export function isAdmin(req: JWTRequest, res: Response, next: NextFunction) {
  if(req.auth?.role === "admin") {
    next()
  } else {
    res.status(403).json({ error: { message: "Forbidden" }})
  }
}
  