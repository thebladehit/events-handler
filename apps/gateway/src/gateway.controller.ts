import { Body, Controller, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Event } from '@app/common';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post('/events')
  handleEvent(@Body() payload: Event[]) {
    this.gatewayService.handleEvent(payload);
  }
}
