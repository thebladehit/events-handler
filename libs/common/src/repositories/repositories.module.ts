import { Module } from '@nestjs/common';
import { FacebookRepository, TiktokRepository } from './interfaces';
import { FacebookRepositoryImpl } from './facebook.repository';
import { TiktokRepositoryImpl } from './tiktok.repository';
import { PrismaService } from '@app/common/prisma';

@Module({
  providers: [
    {
      provide: FacebookRepository,
      useClass: FacebookRepositoryImpl,
    },
    {
      provide: TiktokRepository,
      useClass: TiktokRepositoryImpl,
    },
    PrismaService,
  ],
  exports: [FacebookRepository, TiktokRepository],
})
export class RepositoriesModule {}
