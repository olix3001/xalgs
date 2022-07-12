const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

(async () => {
  // Initialize test user
  const user = await prisma.user.create({
    data: {
      email: 'olix3001@olix3001.xyz',
      pass: 'e1ff99d5a79f439823b4d34c1d0c6c4c242cf52140edfdba16400619e3337331',
      salt: 'SALT',
      username: 'olix3001',
    },
  });

  // Initialize test task
  const task = await prisma.task.create({
    data: {
      author: {
        connect: {
          id: user.id,
        },
      },
      name: 'CI/CD Test',
      message: 'This is a task created for automated CI/CD pipeline tests',
      timeLimit: 2,
      memLimit: 4,
    },
  });

  // Initialize second task for search test
  await prisma.task.create({
    data: {
      author: {
        connect: {
          id: user.id,
        },
      },
      name: 'CI/CD SEARCH',
      message:
        'This is a task created for automated CI/CD pipeline tests (SEARCH TEST)',
      timeLimit: 5,
      memLimit: 5,
    },
  });

  // Create some tests
  for (let i = 0; i < 10; ++i) {
    // Create some random input data
    const numbers = [];
    for (let j = 0; j < Math.floor(Math.random() * 10) + 2; j++) {
      numbers.push(Math.floor(Math.random() * 10000));
    }
    // Add this test to the database
    await prisma.test.create({
      data: {
        content: numbers.join(' '),
        expectedOut: numbers.reduce((a, b) => a + b).toString(),

        task: {
          connect: {
            id: task.id,
          },
        },
      },
    });
  }
})();
