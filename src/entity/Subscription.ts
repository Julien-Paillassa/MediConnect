import { Entity, PrimaryColumn, ManyToOne, OneToOne, Column, JoinColumn } from 'typeorm'
import { User } from './User'
import { Plan } from './Plan'

@Entity()
export class Subscription {
  @PrimaryColumn()
    id!: string

  @Column()
    userId!: string

  @Column()
    planId!: string

  @OneToOne(() => User, (user) => user.subscription, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
    user!: User

  @ManyToOne(() => Plan, (plan) => plan.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planId' })
    plan!: Plan

  @Column({ nullable: false, default: false })
    active!: boolean
}
