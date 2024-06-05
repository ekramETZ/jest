import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookings } from './entities/booking.entity';
import { BookingController } from './bookings.controller';
import { BookingService } from './bookings.service';
import { Agents } from 'src/agents/entities/agent.entity';
import { Ticketed } from 'src/ticketed/entities/ticketed.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Bookings, Agents,Ticketed])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
