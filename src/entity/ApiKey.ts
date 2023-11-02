import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm'
import { User } from './User'

@Entity()
@Unique(['key'])
export class ApiKey {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({
    length: 32,
    type: 'char',
    unique: true,
    default: () => 'md5(random()::text)'
  })
    key!: string

  @Column({ length: 100 })
    name!: string

  @CreateDateColumn()
    createdAt!: Date

  @Column({ type: 'timestamptz' })
    expiresAt!: Date

  @ManyToOne(() => User, (user) => user.id)
    owner!: User
}
