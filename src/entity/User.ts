import { Entity, Column, PrimaryColumn, OneToMany, OneToOne } from 'typeorm'

import { ApiKey } from './ApiKey'
import { Subscription } from './Subscription'

@Entity()
export class User {
  @PrimaryColumn()
    id!: string

  @Column({ length: 100 })
    name!: string

  @Column({ length: 100, unique: true })
    email!: string

  @Column({ length: 100 })
    password!: string

  @OneToMany(() => ApiKey, (apiKey) => apiKey.owner)
    apiKeys!: ApiKey[]

  @OneToOne(() => Subscription, (subscription) => subscription.user, { nullable: true })
    subscription?: Subscription
}
