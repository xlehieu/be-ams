import { DataSource } from 'typeorm';
import { Department } from '../../modules/departments/entities/department.entity'; // Đường dẫn tới entity của bạn

export async function seedDepartments(dataSource: DataSource) {
//connect tới table departments
  const departmentRepository = dataSource.getRepository(Department);

  console.log('Checking existing departments...');
//   const count = await departmentRepository.count();
//   if (count > 0) {
//     console.log(`Departments already seeded (${count} records). Skipping...`);
//     return;
//   }

  console.log('Generating 100,000 department records...');
  
  const TOTAL_RECORDS = 100;
  const CHUNK_SIZE = 5_000; // Chia nhỏ mỗi lần insert 5,000 bản ghi để tối ưu RAM và DB
  
  const startTime = Date.now();

  for (let i = 0; i < TOTAL_RECORDS; i += CHUNK_SIZE) {
    const chunk: Partial<Department>[] = [];
    
    for (let j = 0; j < CHUNK_SIZE && (i + j) < TOTAL_RECORDS; j++) {
      const index = i + j + 1;
      chunk.push({
        name: `Phòng Ban ${index}`,
        department_code: `AMS_${index.toString().padStart(6, '0')}`,
        parent_id: undefined,
      });
    }

    // Dùng QueryBuilder để bulk insert cực nhanh
    await departmentRepository
      .createQueryBuilder()
      .insert()
      .into(Department)
      .values(chunk)
      .execute();

    console.log(`Inserted ${Math.min(i + CHUNK_SIZE, TOTAL_RECORDS)} / ${TOTAL_RECORDS} records...`);
  }

  const endTime = Date.now();
  console.log(`Successfully seeded 100,000 departments in ${(endTime - startTime) / 1000} seconds!`);
}