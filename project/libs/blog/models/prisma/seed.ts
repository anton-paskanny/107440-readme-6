import { PrismaClient } from '@prisma/client';

const FIRST_POST_UUID = '6d308040-96a2-4162-bea6-2338e9976540';
const SECOND_POST_UUID = 'ab04593b-da99-4fe3-8b4b-e06d82e2efdd';

const FIRST_USER_ID = '658170cbb954e9f5b905ccf4';
const SECOND_USER_ID = '6581762309c030b503e30512';

function getPosts() {
  return [
    {
      id: FIRST_POST_UUID,
      title: 'Худеющий',
      userId: FIRST_USER_ID,
      content: 'Недавно прочитал страшный роман «Худеющий».',
      state: 'Черновик',
      description:
        'На мой взгляд, это один из самых страшных романов Стивена Кинга.',
    },
    {
      id: SECOND_POST_UUID,
      title: 'Вы не знаете JavaScript',
      userId: FIRST_USER_ID,
      content: 'Полезная книга по JavaScript',
      description: 'Секреты и тайные знания по JavaScript.',
      state: 'Опубликован',
      comments: [
        {
          message: 'Это действительно отличная книга!',
          userId: FIRST_USER_ID,
        },
        {
          message:
            'Надо будет обязательно перечитать. Слишком много информации.',
          userId: SECOND_USER_ID,
        },
      ],
    },
  ];
}

async function seedDb(prismaClient: PrismaClient) {
  const mockPosts = getPosts();
  for (const post of mockPosts) {
    await prismaClient.post.create({
      data: {
        id: post.id,
        title: post.title,
        description: post.description,
        content: post.description,
        userId: post.userId,
        state: post.state,
        comments: post.comments
          ? {
              create: post.comments,
            }
          : undefined,
      },
    });
  }

  console.info('🤘️ Database was filled');
}

async function bootstrap() {
  const prismaClient = new PrismaClient();

  try {
    await seedDb(prismaClient);
    globalThis.process.exit(0);
  } catch (error: unknown) {
    console.error(error);
    globalThis.process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
}

bootstrap();
