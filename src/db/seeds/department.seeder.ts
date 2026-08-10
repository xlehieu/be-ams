import { DataSource } from 'typeorm';
import { Department } from '../../modules/departments/entities/department.entity'; // Đường dẫn tới entity của bạn

// Mảng tên phòng ban mẫu để random — bạn thêm bớt tùy ý
const DEPARTMENT_NAMES = [
  'Phòng Kỹ Thuật',
  'Phòng Nhân Sự',
  'Phòng Kế Toán',
  'Phòng Kinh Doanh',
  'Phòng Marketing',
  'Phòng Chăm Sóc Khách Hàng',
  'Phòng Pháp Chế',
  'Phòng Vận Hành',
  'Phòng Nghiên Cứu Phát Triển',
  'Phòng Hành Chính',
  'Phòng IT',
  'Phòng Đào Tạo',
  'Phòng Thu Mua',
  'Phòng Logistics',
  'Phòng Quản Lý Chất Lượng',
];

function getRandomName(): string {
  const randomIndex = Math.floor(Math.random() * DEPARTMENT_NAMES.length);
  return DEPARTMENT_NAMES[randomIndex];
}

export async function seedDepartments(dataSource: DataSource) {
  // connect tới table departments
  const departmentRepository = dataSource.getRepository(Department);

  console.log('Checking existing departments...');
  //   const count = await departmentRepository.count();
  //   if (count > 0) {
  //     console.log(`Departments already seeded (${count} records). Skipping...`);
  //     return;
  //   }

  const TOTAL_RECORDS = 30_000;
  const CHUNK_SIZE = 5_000; // Chia nhỏ mỗi lần insert 5,000 bản ghi để tối ưu RAM và DB

  console.log(`Generating ${TOTAL_RECORDS} department records...`);

  const startTime = Date.now();

  for (let i = 0; i < TOTAL_RECORDS; i += CHUNK_SIZE) {
    const chunk: Partial<Department>[] = [];

    for (let j = 0; j < CHUNK_SIZE && i + j < TOTAL_RECORDS; j++) {
      const index = i + j + 1;
      chunk.push({
        name: getRandomName(),
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
  console.log(`Successfully seeded ${TOTAL_RECORDS} departments in ${(endTime - startTime) / 1000} seconds!`);
}