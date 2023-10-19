/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, type Request, type Response } from 'express'
import UserServices from '../services/userServices'

const router = Router()
const userServices = new UserServices()

router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await userServices.getAllUsers()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' })
  }
})

router.post('/users', async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body
    if (name === null || password === null) {
      return res.status(400).json({ error: 'Le nom et le mot de passe sont requis.' })
    }

    const user = await userServices.createUser(name, password)
    if (user != null) {
      res.json(user)
    } else {
      res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' })
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Erreur', details: error.message })
  }
})

router.get('/users/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10)
  const user = await userServices.getUserById(userId)
  if (user != null) {
    res.json(user)
  } else {
    res.status(404).json({ error: 'User not found' })
  }
})

router.put('/users/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10)
  const updatedUser = req.body
  const user = await userServices.updateUser(userId, updatedUser)
  if (user != null) {
    res.json(user)
  } else {
    res.status(404).json({ error: 'User not found' })
  }
})

router.delete('/users/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10)
  await userServices.deleteUser(userId)
  res.status(204).send()
})

export default router
