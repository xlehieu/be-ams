import { dataSourceOptions } from '../data-source';
import { seedDepartments } from './department.seeder';

async function runSeed() {
  try {
    await dataSourceOptions.initialize();
    console.log('Database connected successfully for seeding!');

    await seedDepartments(dataSourceOptions);

    console.log('All seeding completed!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await dataSourceOptions.destroy();
  }
}

runSeed();