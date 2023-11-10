import { Entity, PrimaryColumn, ManyToOne, Column, JoinColumn } from 'typeorm'
import { User } from './User'
import { Subscription } from './Subscription'

@Entity()
export class UserSubscription {
  @PrimaryColumn()
    userId!: string

  @PrimaryColumn()
    subscriptionId!: string

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
    user!: User

  @ManyToOne(() => Subscription, (subscription) => subscription.id)
  @JoinColumn({ name: 'subscriptionId' })
    subscription!: Subscription

  @Column({ nullable: false, default: false })
    active!: boolean
}
