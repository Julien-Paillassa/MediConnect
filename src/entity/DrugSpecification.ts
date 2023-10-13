import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { DrugPackage } from './DrugPackage'
import { DrugComposition } from './DrugComposition'
import { DrugGeneric } from './DrugGeneric'

export enum OriginalDatabaseStatus {
  ALERT = 'Alerte',
  WARNING = 'Warning disponibilité'
}

export enum MarketingAuthorizationStatus {
  ACTIVE = 'Autorisation active',
  ABROGATED = 'Autorisation abrogée',
  ARCHIVED = 'Autorisation archivée',
  WITHDRAWN = 'Autorisation retirée',
  SUSPENDED = 'Autorisation suspendue'
}

@Entity()
export class DrugSpecification {
  @PrimaryColumn()
    id!: number

  @Column()
    name!: string

  @Column()
    form!: string

  @Column('simple-array')
    deliveries!: string[]

  @Column(
    {
      type: 'enum',
      enum: MarketingAuthorizationStatus
    }
  )
    marketingAuthorizationStatus!: MarketingAuthorizationStatus

  @Column()
    marketingAuthorizationProcedure!: string

  @Column()
    isBeingMarketed!: boolean

  @Column()
    marketingAuthorizationDate!: string

  @Column({
    type: 'enum',
    enum: OriginalDatabaseStatus,
    nullable: true
  })
    ogDbStatus?: OriginalDatabaseStatus

  @Column({ nullable: true })
    europeanAuthorizationNumber?: string

  @Column('simple-array')
    holders!: string[]

  @Column()
    reinforcedMonitoring!: boolean

  @OneToMany(() => DrugPackage, (drugPackage) => drugPackage.drug)
    packages!: DrugPackage[]

  @OneToMany(() => DrugComposition, (composition) => composition.drug)
    compositions?: DrugComposition[]

  @OneToMany(() => DrugGeneric, (generic) => generic.drug)
    generics?: DrugGeneric[]

  @Column({ nullable: true })
    prescriptionRestriction?: string
}
