import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { DrugGeneric } from './DrugGeneric'

@Entity()
export class Generic {
  @PrimaryColumn()
    id!: number

  @Column()
    name!: string

  @OneToMany(() => DrugGeneric, (drug) => drug.generic)
    drugs!: DrugGeneric[]
}
