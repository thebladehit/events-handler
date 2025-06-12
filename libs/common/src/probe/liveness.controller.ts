import { Controller, Get } from '@nestjs/common';

@Controller('/liveness')
export class LivenessController {
  @Get()
  checkLiveness() {
    return { status: 'ok', timestamp: new Date() };
  }
}
