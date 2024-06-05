import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Bookings } from 'src/bookings/entities/booking.entity';
import { Agents } from './entities/agent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookings, Agents])],
  controllers: [AgentsController],
  providers: [AgentsService],
})
export class AgentsModule {}
