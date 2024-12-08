import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seedGlobalUser() {
    const globalUser = await prisma.user.upsert({
      where: { email: 'global@qik.com' },
      update: {},
      create: {
        id: 'global-user',
        email: 'global@qik.com',
        name: 'Global User',
      },
    });
  
    return globalUser.id;
  }

  async function seedCategories(globalUserID: string) {
    const defaultCategories = [
      { title: 'Ăn uống' },
      { title: 'Giải trí' },
      { title: 'Di chuyển' },
      { title: 'Xã hội' },
      { title: 'Sửa chữa' },
      { title: 'Mua sắm' },
      { title: 'Công việc' },
    ];
  
    for (const category of defaultCategories) {
        await prisma.category.upsert({
          where: { title_userID: { title: category.title, userID: globalUserID } },
          update: {},
          create: {
            title: category.title,
            userID: globalUserID,
          },
        });
    }    
  }
  
  async function main() {
    const globalUserID = await seedGlobalUser();
    await seedCategories(globalUserID);
  }
  
  main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());