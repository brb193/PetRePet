require('dotenv').config();

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const perfisPadrao = ['ADMIN', 'VETERINARIO', 'RECEPCIONISTA'];

async function main() {
  for (const nome of perfisPadrao) {
    await prisma.perfil.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }

  const perfilAdmin = await prisma.perfil.findUniqueOrThrow({
    where: { nome: 'ADMIN' },
  });
  const senha = await bcrypt.hash('admin123', 10);

  await prisma.usuario.upsert({
    where: { email: 'admin@petrepet.com' },
    update: {
      nome: 'Admin PetRePet',
      senha,
      perfilId: perfilAdmin.id,
    },
    create: {
      nome: 'Admin PetRePet',
      email: 'admin@petrepet.com',
      senha,
      perfilId: perfilAdmin.id,
    },
  });

  console.log('Perfis padrão e usuário administrador configurados.');
}

main()
  .catch((error) => {
    console.error('Falha ao executar a seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
