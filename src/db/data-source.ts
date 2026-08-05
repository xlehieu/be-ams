import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Department } from '@/modules/departments/entities/department.entity';

dotenv.config();
// cấu hình datasource để kết nối khi seed data
export const dataSourceOptions = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Department],
  logging: true,
  synchronize: false,
});

export default dataSourceOptions;