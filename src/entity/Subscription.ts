import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { User } from './User'

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
    id!: number
<<<<<<< HEAD

  @Column({ length: 100 })
    name!: string
=======
>>>>>>> ec2d5f2 (CRUD user done)

  @Column()
    price!: number

  @Column()
<<<<<<< HEAD
    ratePerMonth!: number

  @Column()
    overageFeePerRequest!: number
=======
    duration!: number
>>>>>>> ec2d5f2 (CRUD user done)

  @OneToMany(() => User, (user) => user.subscription)
    users!: User[]
}
