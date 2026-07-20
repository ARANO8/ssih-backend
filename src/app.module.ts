import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { PrismaPg } from '@prisma/adapter-pg';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        prismaOptions: {
          adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
