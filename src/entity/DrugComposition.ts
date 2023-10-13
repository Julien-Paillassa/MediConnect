import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { DrugSpecification } from './DrugSpecification'

export enum SubstanceNatureType {
  ACTIVE_SUBSTANCE = 'SA',
  THEURAPEUTIC_MOIETY = 'FT'
}

@Entity()
export class DrugComposition {
  @PrimaryGeneratedColumn()
    id!: number

  @ManyToOne(() => DrugSpecification, (drug) => drug.id)
    drug!: DrugSpecification

  @Column()
    name!: string

  @Column()
    substanceCode!: string

  @Column()
    substanceName!: string

  @Column({ nullable: true })
    substanceDosage?: string

  @Column({ nullable: true })
    substanceDosageReference?: string

  @Column({
    type: 'enum',
    enum: SubstanceNatureType
  })
    substanceNature!: SubstanceNatureType

  @Column()
    substancesLinkNumber!: number
}
