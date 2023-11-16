import { Entity, PrimaryColumn, ManyToOne, Column, JoinColumn } from 'typeorm'
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

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
    user!: User

  @ManyToOne(() => Plan, (plan) => plan.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planId' })
    plan!: Plan

  @Column({ nullable: false, default: false })
    active!: boolean
}
