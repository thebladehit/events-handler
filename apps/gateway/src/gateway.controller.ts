import { Body, Controller, ParseArrayPipe, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { EventDto } from './dto/event.dto';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post('/events')
  async handleEvent(@Body(new ParseArrayPipe({ items: EventDto })) events: EventDto[]) {
    await this.gatewayService.handleEvent(events);
    return 'ok';
  }
}
