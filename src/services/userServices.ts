import AppDataSource from '../data-source'
import { ApiKey } from '../entity/ApiKey'
import { Subscription } from '../entity/Subscription'
import { User } from '../entity/User'

export default class UserServices {
  private readonly userRepository = AppDataSource.getRepository(User)

  public async getAllUsers (): Promise<User[]> {
    return await this.userRepository.find({ relations: ['subscription', 'apiKeys'] })
  }

  public async createUser (name: string, email: string, password: string): Promise<User | undefined> {
    try {
      const newUser = new User()
      newUser.name = name
      newUser.email = email
      newUser.password = password
      // Récupérez la souscription par son ID
      const subscriptionId = 1
      const subscriptionRepository = AppDataSource.getRepository(Subscription)
      const subscription = await subscriptionRepository.findOneOrFail({
        where: { id: subscriptionId }
      })

      newUser.subscription = subscription

      // Récupérez la clé API par son ID
      const apiKeyId = 1
      const apiKeyRepository = AppDataSource.getRepository(ApiKey)
      const apiKey = await apiKeyRepository.findOneOrFail({
        where: { id: apiKeyId }
      })

      newUser.apiKeys = [apiKey]

      const savedUser = await this.userRepository.save(newUser)
      return savedUser
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error)
      return undefined
    }
  }

  public async getUserById (userId: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['subscription', 'apiKeys']
    })
  }

  public async updateUser (userId: number, updatedUser: Partial<User>): Promise<User | null> {
    await this.userRepository.update(userId, updatedUser)
    return await this.getUserById(userId)
  }

  public async deleteUser (userId: number): Promise<void> {
    await this.userRepository.delete(userId)
  }
}
