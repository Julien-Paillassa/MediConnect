import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { DrugSpecification } from './DrugSpecification'

export enum SubstanceNatureType {
  ACTIVE_SUBSTANCE = 'SA',
  THEURAPEUTIC_MOIETY = 'FT'
}

@Entity()
export class DrugComposition {
  @PrimaryGeneratedColumn()
    id!: number

  // https://typeorm.io/relations-faq#how-to-use-relation-id-without-joining-relation
  @Column({ nullable: true })
    drugId?: number

  @ManyToOne(() => DrugSpecification, (drug) => drug.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'drugId' })
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

  @Column({ type: 'enum', enum: SubstanceNatureType })
    substanceNature!: SubstanceNatureType

  @Column()
    substancesLinkNumber!: number
}
