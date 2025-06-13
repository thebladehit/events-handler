import { Body, Controller, ParseArrayPipe, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { EventDto } from './dto/event.dto';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post('/events')
  handleEvent(@Body() events: EventDto[]) {
    return this.gatewayService.handleEvent(events);
  }
}
