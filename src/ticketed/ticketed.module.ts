import { Module } from '@nestjs/common';
import { TicketedService } from './ticketed.service';
import { TicketedController } from './ticketed.controller';

@Module({
  controllers: [TicketedController],
  providers: [TicketedService],
})
export class TicketedModule {}
