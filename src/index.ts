import 'reflect-metadata'
import app from './app'
import AppDataSource from './data-source'

AppDataSource.initialize()
  .then(async () => {
    console.log('Database connection success')

    //   console.log('Inserting a new user into the database...')
    //   const user = new User()
    //   user.firstName = 'Timber'
    //   user.lastName = 'Saw'
    //   user.age = 25
    //   await AppDataSource.manager.save(user)
    //   console.log('Saved a new user with id: ' + user.id)

    //   console.log('Loading users from the database...')
    //   const users = await AppDataSource.manager.find(User)
    //   console.log('Loaded users: ', users)

    //   console.log('Here you can setup and run express / fastify / any other framework.')
  })
  .catch((err: any) => { console.log(err) })

app.listen(process.env.API_HOST ?? 3000, () => {
  console.log(`Server is running on port ${process.env.API_HOST ?? 3000}`)
})
