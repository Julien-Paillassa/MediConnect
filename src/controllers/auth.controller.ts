import { Request, Response } from 'express';
import AppDataSource from "../data-source";
import { User } from "../entity/User";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
    const { name, password } = req.body;
    const userRepository = AppDataSource.manager.getRepository(User);

    try {
        const user = await userRepository.findOne({ where: { name } });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password.'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed. Invalid password.'
            });
        }

        const token = jwt.sign({ id: user.id, name: user.name }, process.env.TOKEN_SECRET_KEY!);
        
        return res.json({
            success: true,
            token,
            name: user.name
        });

    } catch (error: any) {
        return res.status(500).json({ 
            success: false,
            message: error?.message || 'An error occurred'
        });
    }    
};