import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './bookings.controller';
import { BookingService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bookings } from './entities/booking.entity';
import { Agents } from '../agents/entities/agent.entity';
import { Ticketed } from '../ticketed/entities/ticketed.entity';

describe('BookingsController', () => {
  let controller: BookingController;
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Bookings),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Agents),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Ticketed),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<BookingController>(BookingController);
    service = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
