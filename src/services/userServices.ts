import AppDataSource from '../data-source'
import { ApiKey } from '../entity/ApiKey'
import { Subscription } from '../entity/Subscription'
import { User } from '../entity/User'

export default class UserServices {
  private readonly userRepository = AppDataSource.getRepository(User)

  public async getAllUsers (): Promise<User[]> {
    return await this.userRepository.find({ relations: ['subscription', 'apiKeys'] })
  }

  public async createUser (name: string, password: string): Promise<User | undefined> {
    try {
      const newUser = new User()
      newUser.name = name
      newUser.password = password
      // Récupérez la souscription par son ID, ou créez-en une nouvelle si elle n'existe pas.
      const subscriptionId = 1
      const subscriptionRepository = AppDataSource.getRepository(Subscription)
      const subscription = await subscriptionRepository.findOne({
        where: { id: subscriptionId }
      })

      if (subscription === null) {
        const newSubscription = new Subscription()

        newSubscription.id = 1
        newSubscription.price = 40
        newSubscription.duration = 200

        await subscriptionRepository.save(newSubscription)
        newUser.subscription = newSubscription
      } else {
        newUser.subscription = subscription
      }

      // Récupérez la clé API par son ID, ou créez-en une nouvelle si elle n'existe pas.
      const apiKeyId = 1
      const apiKeyRepository = AppDataSource.getRepository(ApiKey)
      const apiKey = await apiKeyRepository.findOne({
        where: { id: apiKeyId }
      })

      if (apiKey === null) {
        const newApiKey = new ApiKey()

        newApiKey.id = 1
        newApiKey.key = 1535866355
        newApiKey.name = 'test apiKey'

        await apiKeyRepository.save(newApiKey)
        newUser.apiKeys = [newApiKey]
      } else {
        newUser.apiKeys = [apiKey]
      }

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
