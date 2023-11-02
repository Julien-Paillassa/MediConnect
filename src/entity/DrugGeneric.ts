import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm'
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

  @Column({ nullable: true })
    drugId?: number

  @ManyToOne(() => DrugSpecification, (drug) => drug.id)
  @JoinColumn({ name: 'drugId' })
    drug!: DrugSpecification

  @Column({ nullable: true })
    genericId?: number

  @ManyToOne(() => Generic, (generic) => generic.id)
  @JoinColumn({ name: 'genericId' })
    generic!: Generic

  @Column({ type: 'enum', enum: GenericType })
    type!: GenericType

  @Column()
    rank!: number
}
