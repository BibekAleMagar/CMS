import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../modules/user/entities/user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';

export async function createSuperAdmin(dataSource: DataSource) {
  const repo = dataSource.getRepository(User);

  const exists = await repo.findOne({
    where: { email: 'superadmin@example.com' },
  });

  if (exists) {
    console.log('ℹ️ Super admin already exists');
    return;
  }

  const user = repo.create({
  email: 'superadmin@example.com',
  password: await bcrypt.hash('SuperAdmin@123', 10),
  firstName: 'Super',
  lastName: 'Admin',
  role: UserRole.SUPER_ADMIN,
  isActive: true,
  avatar: "",
  phone: ""
});


  await repo.save(user);
  console.log('✅ Super admin created with email:')
}
