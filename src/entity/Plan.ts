import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class Plan {
  @PrimaryColumn()
    id!: string

  @Column({ length: 100 })
    name!: string

  @Column()
    ratePerMonth!: number
}
