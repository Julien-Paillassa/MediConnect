import { Request, Response } from 'express';
import AppDataSource from "../data-source";
import { User } from '../entity/User';
import bcrypt from 'bcrypt';

export class UserController {

    // static findAll = async (req: Request, res: Response) => {
    //     try {
    //         const userRepository = AppDataSource.manager.find(User);
    //         const users = await userRepository.find();
    //         res.json(users);
    //     } catch (error) {
    //         res.status(500).send(error);
    //     }
    // }

    static findById = async (req: Request, res: Response) => {
        const userId: number = parseInt(req.params.id);

        try {
            const userRepository = AppDataSource.manager.getRepository(User);
            const user = await userRepository.findOne({ where: { id: userId } });

            if (!user) {
                res.status(404).send('User not found');
                return;
            }

            res.json(user);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    static store = async (req: Request, res: Response) => {
        const { name, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = new User();
        user.name = name;
        user.password = hashedPassword;

        try {
            const userRepository = AppDataSource.manager.getRepository(User);
            const savedUser = await userRepository.save(user);
            res.status(201).json(savedUser);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    static update = async (req: Request, res: Response) => {
        const userId: number = parseInt(req.params.id);

        try {
            const userRepository = AppDataSource.manager.getRepository(User);
            const user = await userRepository.findOne({ where: { id: userId } });

            if (!user) {
                res.status(404).send('User not found');
                return;
            }

            // Update fields accordingly
            if (req.body.name) user.name = req.body.name;
            if (req.body.password) user.password = bcrypt.hashSync(req.body.password, 10);

            const updatedUser = await userRepository.save(user);
            res.json(updatedUser);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    static destroy = async (req: Request, res: Response) => {
        const userId: number = parseInt(req.params.id);

        try {
            const userRepository = AppDataSource.manager.getRepository(User);
            const user = await userRepository.findOne({ where: { id: userId } });

            if (!user) {
                res.status(404).send('User not found');
                return;
            }

            await userRepository.remove(user);
            res.status(200).send('User deleted successfully');
        } catch (error) {
            res.status(500).send(error);
        }
    }
}