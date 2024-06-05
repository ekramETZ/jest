import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Bookings } from './entities/booking.entity';
import { BookingService } from './bookings.service';

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ status: 201, description: 'The booking has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all bookings' })
  @ApiResponse({ status: 200, description: 'Return all bookings.' })
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a booking by ID' })
  @ApiParam({ name: 'id', description: 'ID of the booking', type: 'string' })
  @ApiResponse({ status: 200, description: 'Return the booking.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async findOne(@Param('id') id: string): Promise<Bookings> {
    return this.bookingService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a booking' })
  @ApiParam({ name: 'id', description: 'ID of the booking', type: 'string' })
  @ApiBody({ type: UpdateBookingDto })
  @ApiResponse({ status: 200, description: 'The booking has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a booking' })
  @ApiParam({ name: 'id', description: 'ID of the booking', type: 'string' })
  @ApiResponse({ status: 200, description: 'The booking has been successfully removed.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }



  @Post('generate/:bookingId')
  async generateTicket(@Param('bookingId') bookingId: string): Promise<void> {
    await this.bookingService.generateTicket(bookingId);
  }
}
