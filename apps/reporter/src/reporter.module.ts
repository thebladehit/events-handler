import { Module } from '@nestjs/common';
import { ReporterController } from './reporter.controller';
import { ReporterService } from './reporter.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { RepositoriesModule } from '@app/common/repositories';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    RepositoriesModule,
  ],
  controllers: [ReporterController],
  providers: [ReporterService],
})
export class ReporterModule {}
