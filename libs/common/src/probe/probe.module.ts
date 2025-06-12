import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaReadiness } from '@app/common/probe/prisma.readiness';
import { JetStreamReadiness } from '@app/common/probe';
import { LivenessController } from './liveness.controller';
import { NatsModule } from '@app/common/jet-streams/nats';
import { PrismaService } from '@app/common/prisma';

@Module({})
export class SharedProbeModule {
  static forRoot(options: { usePrisma?: boolean; useJetSteams?: boolean }) {
    const providers = [];
    const imports = [];
    if (options.usePrisma) {
      providers.push(PrismaReadiness, PrismaService);
    }
    if (options.useJetSteams) {
      providers.push(JetStreamReadiness);
      imports.push(NatsModule);
    }
    return {
      module: SharedProbeModule,
      imports: [TerminusModule, ...imports],
      providers,
      controllers: [LivenessController],
      exports: providers,
    };
  }
}
