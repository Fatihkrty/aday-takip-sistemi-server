import { join } from 'path';
import { readFileSync } from 'fs';

import prisma from './prisma';
import { hashPassword } from '../utils/bcrypt';

function parseFileAsJson(fileName: string): string[] {
  const filePath = join(__dirname, '..', '..', 'bin', fileName);
  const readFile = readFileSync(filePath, { encoding: 'utf-8' });
  return JSON.parse(readFile);
}

// async function loadLanguages() {
//   try {
//     const count = await prisma.language.count();

//     if (count) return;

//     const chunkSize = 500;
//     const jsonData = parseFileAsJson('languages.json');

//     for (let i = 0; i < jsonData.length; i += chunkSize) {
//       const chunkData = jsonData.slice(i, i + chunkSize);

//       await prisma.language.createMany({
//         data: chunkData.map((x) => ({ name: x })),
//       });
//     }

//     console.info('Eklenen dil sayısı: ', jsonData.length);
//   } catch (error) {
//     console.error(error);
//   }
// }

async function loadPositions() {
  try {
    const count = await prisma.position.count();

    if (count) return;

    const chunkSize = 500;
    const jsonData = parseFileAsJson('positions.json');

    for (let i = 0; i < jsonData.length; i += chunkSize) {
      const chunkData = jsonData.slice(i, i + chunkSize);

      await prisma.position.createMany({
        data: chunkData.map((x) => ({ name: x })),
      });
    }

    console.info('Eklenen pozisyon sayısı: ', jsonData.length);
  } catch (error) {
    console.error(error);
  }
}

async function loadLocations() {
  try {
    const count = await prisma.location.count();

    if (count) return;

    const chunkSize = 500;
    const jsonData = parseFileAsJson('locations.json');

    for (let i = 0; i < jsonData.length; i += chunkSize) {
      const chunkData = jsonData.slice(i, i + chunkSize);

      await prisma.location.createMany({
        data: chunkData.map((x) => ({ name: x })),
      });
    }

    console.info('Eklenen lokasyon sayısı: ', jsonData.length);
  } catch (error) {
    console.error(error);
  }
}

async function loadSectors() {
  try {
    const count = await prisma.sector.count();

    if (count) return;

    const chunkSize = 500;
    const jsonData = parseFileAsJson('sectors.json');

    for (let i = 0; i < jsonData.length; i += chunkSize) {
      const chunkData = jsonData.slice(i, i + chunkSize);

      await prisma.sector.createMany({
        data: chunkData.map((x) => ({ name: x })),
      });
    }

    console.info('Eklenen sektör sayısı: ', jsonData.length);
  } catch (error) {
    console.error(error);
  }
}

async function createDefaultUser() {
  try {
    const count = await prisma.user.count({ where: { role: 'admin' } });
    if (count) return;

    const password = await hashPassword('123123');

    await prisma.user.create({
      data: {
        email: 'fatih@fatih.com',
        name: 'Fatih Karatay',
        role: 'admin',
        secret: {
          create: { password },
        },
      },
    });

    console.info('Default kullanıcı eklendi');
  } catch (error) {
    console.error(error);
  }
}

export default async function startSeed() {
  await Promise.all([loadLocations(), loadPositions(), loadSectors(), createDefaultUser()]);
}
