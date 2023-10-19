import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { User } from './User'

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ length: 100 })
    name!: string

  @Column()
    price!: number

  @Column()
    ratePerMonth!: number

  @Column()
    overageFeePerRequest!: number

  @OneToMany(() => User, (user) => user.subscription)
    users!: User[]
}
