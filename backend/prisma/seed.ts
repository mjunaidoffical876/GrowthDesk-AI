import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('GrowthDesk@123', 10);

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-agency' },
    update: {},
    create: {
      companyName: 'Demo Agency',
      slug: 'demo-agency',
      email: 'demo@growthdesk.ai',
      subscriptionStatus: 'trial',
    },
  });

  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'owner@growthdesk.ai' } },
    update: {},
    create: {
      tenantId: tenant.id,
      fullName: 'Demo Owner',
      email: 'owner@growthdesk.ai',
      passwordHash,
      role: 'owner',
    },
  });

  await prisma.client.createMany({
    data: [
      { tenantId: tenant.id, companyName: 'Alpha Client', contactPerson: 'Ali Khan', email: 'ali@example.com', status: 'active' },
      { tenantId: tenant.id, companyName: 'Beta Client', contactPerson: 'Sara Ahmed', email: 'sara@example.com', status: 'active' },
    ],
    skipDuplicates: true,
  });

  console.log('Demo tenant seeded successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
