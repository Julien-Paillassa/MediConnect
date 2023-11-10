import 'reflect-metadata'
import app from './app'
import AppDataSource from './data-source'

AppDataSource.initialize()
  .then(async () => {
    console.log('Database connection success')
  })
  .catch((err: any) => { console.log(err) })

app.listen(process.env.API_HOST ?? 3000, () => {
  console.log(`Server is running on port ${process.env.API_HOST ?? 3000}`)
})
