import { Request, Response, NextFunction } from 'express';
import AppDataSource from "../data-source";
import jwt from 'jsonwebtoken';
import { User } from '../entity/User';

declare module 'express-serve-static-core' {
    interface Request {
        currentUser?: any;
    }
}

export default async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers['authorization'];
    let token;

    if (authorizationHeader) {
        token = authorizationHeader.split(' ')[1];
    }

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET_KEY!, (err, decoded: any) => {
            if (err) {
                res.status(401).json({ error: 'You are not authorized to perform this operation!' });
            } else {
                const userRepository = AppDataSource.manager.getRepository(User);
                userRepository.findOne({ where: { id: decoded.id }, select: ['email', 'id'] }).then(user => {
                    if (!user) {
                        res.status(404).json({ error: 'No such user' });
                    } else {
                        req.currentUser = user;
                        next();
                    }
                });
            }
        });
    } else {
        res.status(403).json({
            error: 'No token provided'
        });
    }
};