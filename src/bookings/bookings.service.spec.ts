import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Bookings } from './entities/booking.entity';

import { Ticketed } from '../ticketed/entities/ticketed.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import * as nodemailer from 'nodemailer';
import { BookingService } from './bookings.service';
import { Agents } from '../agents/entities/agent.entity';

describe('BookingService', () => {
  let service: BookingService;
  let bookingRepository: Repository<Bookings>;
  let agentRepository: Repository<Agents>;
  let ticketedRepository: Repository<Ticketed>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Bookings),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Agents),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Ticketed),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    bookingRepository = module.get<Repository<Bookings>>(getRepositoryToken(Bookings));
    agentRepository = module.get<Repository<Agents>>(getRepositoryToken(Agents));
    ticketedRepository = module.get<Repository<Ticketed>>(getRepositoryToken(Ticketed));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of bookings', async () => {
      const result = [{ id: 1, name: 'Test Booking' }];
      jest.spyOn(bookingRepository, 'find').mockResolvedValue(result as any);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a booking by ID', async () => {
      const booking = { id: 1, name: 'Test Booking' };
      jest.spyOn(bookingRepository, 'findOne').mockResolvedValue(booking as any);

      expect(await service.findOne(1)).toBe(booking);
    });

    it('should throw a NotFoundException if booking not found', async () => {
      jest.spyOn(bookingRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new booking', async () => {
      const createBookingDto: CreateBookingDto = { name: 'New Booking' };
      const booking = { id: 1, ...createBookingDto };
      jest.spyOn(bookingRepository, 'create').mockReturnValue(booking as any);
      jest.spyOn(bookingRepository, 'save').mockResolvedValue(booking as any);

      expect(await service.create(createBookingDto)).toBe(booking);
    });
  });

  describe('update', () => {
    it('should update a booking', async () => {
      const updateBookingDto: UpdateBookingDto = { name: 'Updated Booking' };
      jest.spyOn(bookingRepository, 'update').mockResolvedValue({ affected: 1 } as any);

      await service.update(1, updateBookingDto);
      expect(bookingRepository.update).toHaveBeenCalledWith(1, updateBookingDto);
    });

    it('should throw a NotFoundException if booking not found', async () => {
      const updateBookingDto: UpdateBookingDto = { name: 'Updated Booking' };
      jest.spyOn(bookingRepository, 'update').mockResolvedValue({ affected: 0 } as any);

      await expect(service.update(1, updateBookingDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a booking', async () => {
      jest.spyOn(bookingRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

      await service.remove(1);
      expect(bookingRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if booking not found', async () => {
      jest.spyOn(bookingRepository, 'delete').mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('generateTicket', () => {
    it('should throw NotFoundException if booking not found', async () => {
      jest.spyOn(bookingRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.generateTicket('123')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if agent not found', async () => {
      const booking = { bookingId: '123', agentId: '456', email: 'test@example.com' };
      jest.spyOn(bookingRepository, 'findOneBy').mockResolvedValue(booking as any);
      jest.spyOn(agentRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.generateTicket('123')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if ticket not found', async () => {
      const booking = { bookingId: '123', agentId: '456', email: 'test@example.com' };
      const agent = { agentId: '456', name: 'Agent' };
      jest.spyOn(bookingRepository, 'findOneBy').mockResolvedValue(booking as any);
      jest.spyOn(agentRepository, 'findOneBy').mockResolvedValue(agent as any);
      jest.spyOn(ticketedRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.generateTicket('123')).rejects.toThrow(NotFoundException);
    });

    it('should generate a ticket and send an email', async () => {
      const booking = { 
        bookingId: '123',
        agentId: '456', 
        email: 'test@example.com', 
        flightdata: '[{"meals": [{"code": "M", "description": "Meal"}], "itemId": "12", "sourceType": "ATPCO", "airlineCode": "EK", "airlineName": "EMIRATES", "arrivalDate": "2024-05-23", "arrivalGate": "3", "arrivalTime": "13:15:00", "bookingClass": "L", "flightNumber": 583, "cabinTypeCode": "Y", "cabinTypeName": "ECONOMY", "departureDate": "2024-05-23", "departureGate": "1", "departureTime": "10:15:00", "numberOfSeats": 1, "toAirportCode": "DXB", "confirmationId": "CML7ES", "distanceInMiles": 2202, "fromAirportCode": "DAC", "travelerIndices": [1], "aircraftTypeCode": "77W", "aircraftTypeName": "BOEING 777-300ER", "flightStatusCode": "HK", "flightStatusName": "Confirmed", "durationInMinutes": 300, "identityDocuments": [{"itemId": "53af00d84f8ab2a4ffe525725e9961e6289c18801e9249082fc640d0735d1b7956c9d393f29e67ba39b18d90e51dbf7b03af74c72609f573b42e8f00a1107d9e", "status": "Confirmed"}, {"itemId": "299025c40f93049b2585908dd197fb79c8182d21b539f773f43f5e79fcf998ead2c1ac23035419f7001d213f06851bb66022539b383606d2a4d608e3cf671734", "status": "Confirmed"}], "arrivalTerminalName": "TERMINAL 3", "operatingAirlineCode": "EK", "operatingAirlineName": "EMIRATES", "departureTerminalName": "TERMINAL 1", "operatingFlightNumber": 583}]',
        companyname: 'AIR TRIP RAVELS AND TOURSIM',
        flightdate: new Date(), 
        itenary: { 
              Carrier: "BS",
        
              AllLegsInfo: [
                      {
                ArrTo: "DXB",
                DepDate: "2024-06-03",
                DepFrom: "DAC",
                Duration: 435,
                Segments: [
                    {
                        ArrTo: "DXB",
                        ArrTime: "2024-06-03T11:30:00+04:00",
                        DepFrom: "DAC",
                        DepTime: "2024-06-03T06:15:00+06:00",
                        Duration: 435,
                        StopCount: 1,
                        ArrAirPort: "Dubai Intl Airport",
                        DepAirPort: "Hazrat Shahjalal Intl Airport",
                        OperatedBy: "US-Bangla Airlines",
                        ArrLocation: "Dubai,UNITED ARAB EMIRATES",
                        ArrivalGate: "1",
                        DepLocation: "Dhaka,BANGLADESH",
                        HiddenStops: [
                            {
                                city: "CGP",
                                airport: "CGP",
                                country: "BD",
                                airMiles: 2312,
                                equipment: "738",
                                arrivalTime: "07:00:00+06:00",
                                elapsedTime: 45,
                                departureTime: "07:45:00+06:00",
                                elapsedLayoverTime: 45
                            }
                        ],
                        SegmentCode: {
                            cabinCode: "Y",
                            bookingCode: "K",
                            seatsAvailable: 9,
                            availabilityBreak: true
                        },
                        DepartureGate: "1",
                        TotalMilesFlown: 2451,
                        AircraftTypeName: "738",
                        MarketingCarrier: "BS",
                        OperatingCarrier: "BS",
                        ArrDateAdjustment: 0,
                        DepDateAdjustment: 0,
                        MarketingCarrierName: "USBangla Airlines",
                        OperatingCarrierName: "USBangla Airlines",
                        MarketingFlightNumber: 343,
                        OperatingFlightNumber: 343
                    }
              ]
          }
      ],
    
      BaseFare: 100,
      GrossFare: 120,
      PriceBreakDown: [{ PaxType: 'ADT', PaxCount: 1, TotalFare: 100 }] },
      totalpax: 1 
      };

      
      const agent = { agentId: '456', name: 'Agent', password: 'secret' };
      const ticket = { bookingId: '123', ticketnumber: '789' };
      jest.spyOn(bookingRepository, 'findOneBy').mockResolvedValue(booking as any);
      jest.spyOn(agentRepository, 'findOneBy').mockResolvedValue(agent as any);
      jest.spyOn(ticketedRepository, 'findOneBy').mockResolvedValue(ticket as any);

      jest.spyOn(nodemailer, 'createTransport').mockReturnValue({
        sendMail: jest.fn().mockResolvedValue(true),
      } as any);

      await service.generateTicket('123');
      expect(nodemailer.createTransport).toHaveBeenCalled();
    });
  });
});
