import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm'
import { User } from './User'

@Entity()
@Unique(['key'])
export class ApiKey {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ length: 32, type: 'char', unique: true })
    key!: string

  @Column({ length: 100 })
    name!: string

  @ManyToOne(() => User, (user) => user.id)
    owner!: User
}
