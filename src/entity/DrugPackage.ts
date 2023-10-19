import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm'
import { DrugSpecification } from './DrugSpecification'

export enum PackageStatus {
  ACTIVE = 'Présentation active',
  ABROGATED = 'Présentation abrogée',
}

export enum MarketingAuthorizationDeclarationStatus {
  BEING_MARKETED = 'Déclaration de commercialisation',
  SUSPENDED = 'Déclaration de suspension de commercialisation',
  STOPPED = 'Arrêt de commercialisation déclaré',
  UNAUTHORIZED = 'Arrêt de commercialisation pour autorisation retirée',
}

@Entity()
export class DrugPackage {
  @PrimaryColumn()
    id!: number

  @Column({ type: 'bigint' })
    longId!: number

  @ManyToOne(() => DrugSpecification, (drug) => drug.id)
    drug!: DrugSpecification

  @Column()
    name!: string

  @Column({
    type: 'enum',
    enum: PackageStatus
  })
    status!: PackageStatus

  @Column({
    type: 'enum',
    enum: MarketingAuthorizationDeclarationStatus
  })
    marketingAuthorizationStatus!: MarketingAuthorizationDeclarationStatus

  @Column()
    marketingAuthorizationDeclarationDate!: string

  @Column()
    isAgreedToCommunities?: boolean

  @Column({ nullable: true })
    refundRate?: number

  @Column({ nullable: true })
    price?: number

  @Column({ nullable: true })
    refundInformation?: string
}
