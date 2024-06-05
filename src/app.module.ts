import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AgentsService } from './agents/agents.service';
import { TicketedService } from './ticketed/ticketed.service';
import { AgentsController } from './agents/agents.controller';
import { TicketedController } from './ticketed/ticketed.controller';
import { MailModule } from './mailer/mail.module';
import { MailService } from './mailer/mail.service';
import { BookingModule } from './bookings/bookings.module';
import { InfoModule } from './info/info.module';
import { WhitelistModule } from './whitelist/whitelist.module';
import { WhitelistController } from './whitelist/whitelist.controller';
import { WhitelistService } from './whitelist/whitelist.service';
import { BookingController } from './bookings/bookings.controller';
import { BookingService } from './bookings/bookings.service';
import { ToursModule } from './tours/tours.module';
import { ToursController } from './tours/tours.controller';
import { ToursService } from './tours/tours.service';
import { AgentsModule } from './agents/agents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    MailModule,
    BookingModule,
    InfoModule,
    WhitelistModule,
    ToursModule,
  ],
  controllers: [
    AgentsController,
    TicketedController,
    BookingController,
    WhitelistController,
    ToursController,
  ],
  providers: [
    AgentsService,
    TicketedService,
    MailService,
    BookingService,
    WhitelistService,
    ToursService,
    AgentsModule
  ],
})
export class AppModule {}
