import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [PinoLoggerModule.forRoot({})],
})
export class LoggerModule {}
