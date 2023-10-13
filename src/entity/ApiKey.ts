import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm'
import { User } from './User'

@Entity()
@Unique(['key'])
export class ApiKey {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  key!: number

  @Column({ length: 100 })
  name!: string

  @ManyToOne(() => User, (user) => user.id)
  owner!: User
}
