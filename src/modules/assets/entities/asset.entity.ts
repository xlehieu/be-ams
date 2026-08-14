import { ASSET_STATUS } from '@/enums/asset-status.enum';
import { AssetCategory } from '@/modules/asset-categories/entities/asset-category.entity';
import { User } from '@/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  asset_code: string;

  @Column({ nullable: true })
  qr_code: string;

  @Column()
  asset_name: string;

  @ManyToOne(() => AssetCategory, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'asset_category_id' })
  asset_category: AssetCategory;

  @Column({ name: 'asset_category_id', nullable: true })
  asset_category_id: number;

  @Column({ nullable: true })
  serial_number: string;
  @Column({ nullable: true })
  purchase_date: Date;

  @Column({ nullable: true, type: 'decimal' })
  purchase_price: number;

  @Column({ nullable: true, type: 'enum', enum: ASSET_STATUS })
  status: ASSET_STATUS;

  @ManyToOne(() => User, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'current_holder_id' })
  current_holder: User;

  @Column({ name: 'current_holder_id', nullable: true })
  current_holder_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
