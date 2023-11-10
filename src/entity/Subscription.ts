import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class Subscription {
  @PrimaryColumn()
    id!: string

  @Column({ length: 100 })
    name!: string

  @Column()
    price!: number

  @Column()
    ratePerMonth!: number

  @Column()
    overageFeePerRequest!: number
}
