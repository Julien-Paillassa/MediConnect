import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { DrugSpecification } from './DrugSpecification'
import { Generic } from './Generic'

export enum GenericType {
  PRINCEPS = 0,
  GENERIC = 1,
  GENERIC_BY_POSOLOGY = 2,
  GENERIC_SUBSTITUABLE = 4,
}

@Entity()
export class DrugGeneric {
  @PrimaryGeneratedColumn()
    id!: number

  @ManyToOne(() => DrugSpecification, (drug) => drug.id)
    drug!: DrugSpecification

  @ManyToOne(() => Generic, (generic) => generic.id)
    generic!: Generic

  @Column({
    type: 'enum',
    enum: GenericType
  })
    type!: GenericType

  @Column()
    rank!: number
}
