import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DEPRECIATIONMETHOD {
  STRAIGHT_LINE = 'STRAIGHT_LINE',
  DECLINING_BALANCE = 'DECLINING_BALANCE',
}
@Entity('asset_categories')
export class AssetCategory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  asset_category_code: string;

  @Column()
  asset_category_name: string;

  @Column({
    nullable: true,
  })
  parent_id: number;

  @Column({
    nullable: true,
  })
  useful_life_months: number;

  @Column({
    type: 'enum',
    enum: DEPRECIATIONMETHOD,
    nullable: true,
  })
  depreciation_method: DEPRECIATIONMETHOD;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
