import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm'

import { ApiKey } from './ApiKey'
import { Subscription } from './Subscription'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ length: 100 })
    name!: string

  @Column({ length: 100, unique: true })
    email!: string

  @Column({ length: 100 })
    password!: string

  @OneToMany(() => ApiKey, (apiKey) => apiKey.owner)
    apiKeys!: ApiKey[]

  @ManyToOne(() => Subscription, (subscritpion) => subscritpion.users)
    subscription!: Subscription
}
