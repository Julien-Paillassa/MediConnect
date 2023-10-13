import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { User } from './User'

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  price!: number

  @Column()
  duration!: number

  @OneToMany(() => User, (user) => user.subscription)
  users!: User[]
}
