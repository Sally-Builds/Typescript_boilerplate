import  jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {verifyToken} from '@/utils/token'
import Token from '@/utils/interfaces/token.interface'
import userModel from '@/resources/user/user.model'
import HttpException from '@/utils/exceptions/httpExceptions'

async function authenticate (req:Request, res:Response, next:NextFunction): Promise<Response | void> {
    const bearer = req.headers.authorization

    if(!bearer || !bearer.startsWith('Bearer')){
        return next(new HttpException('Unauthorized access', 401))
    }
    const accessToken = bearer.split('Bearer ')[1].trim()
    try {
        const payload: Token | jwt.JsonWebTokenError = await verifyToken(accessToken)

        if(payload instanceof jwt.JsonWebTokenError) {
        return next(new HttpException('Unauthorized access', 401))
        }

        const user = await userModel.findById(payload.id).select('-password').exec()

        if(!user) {
            return next(new HttpException('Unauthorized access', 401))
        }

        req.user = user
        next()

    } catch (error:any) {
        next(new HttpException('Unauthorized access', 401))
    }
}

export default authenticate
