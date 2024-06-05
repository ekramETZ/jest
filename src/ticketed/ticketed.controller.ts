import { Controller, Get, Post, Param, Body, Put, Delete, Query, NotFoundException } from '@nestjs/common';
import { TicketedService } from './ticketed.service';
import { Ticketed } from './entities/ticketed.entity';
import { MailService } from '../mailer/mail.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateTicketedDto } from './dto/create-ticketed.dto';

@ApiTags('Ticket')
@Controller('ticketed')
export class TicketedController {
  constructor(
    private readonly ticketedService: TicketedService,
    private readonly mailService: MailService,
  ) {}
  
  @Get()
  @ApiOperation({ summary: 'Get all Ticketed' })
  @ApiResponse({ status: 200, description: 'Get all Ticketed', type: [Ticketed] })
  async findAll(): Promise<Ticketed[]> {
    return this.ticketedService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific ticketed item by ID' })
  @ApiParam({ name: 'id', description: 'ID of the ticketed item to retrieve', type: Number })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the ticketed item', type: Ticketed })
  @ApiResponse({ status: 404, description: 'Ticketed item not found' })
  async findOne(@Param('id') id: number): Promise<Ticketed> {
    return this.ticketedService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new ticketed item' })
  @ApiBody({ description: 'Details of the ticketed item to create', type: CreateTicketedDto })
  @ApiResponse({ status: 201, description: 'Successfully created the ticketed item', type: Ticketed })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createTicketedDto: CreateTicketedDto): Promise<Ticketed> {
    return this.ticketedService.create(createTicketedDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing ticketed item by ID' })
  @ApiParam({ name: 'id', description: 'ID of the ticketed item to update', type: Number })
  @ApiBody({ description: 'Updated details of the ticketed item', type: CreateTicketedDto })
  @ApiResponse({ status: 200, description: 'Successfully updated the ticketed item' })
  @ApiResponse({ status: 404, description: 'Ticketed item not found' })
  async update(@Param('id') id: number, @Body() updateTicketedDto: Partial<CreateTicketedDto>): Promise<void> {
    return this.ticketedService.update(id, updateTicketedDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific ticketed item by ID' })
  @ApiParam({ name: 'id', description: 'ID of the ticketed item to delete', type: Number })
  @ApiResponse({ status: 200, description: 'Successfully deleted the ticketed item' })
  @ApiResponse({ status: 404, description: 'Ticketed item not found' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.ticketedService.remove(id);
  }

  @Post(':id/send-email')
  @ApiOperation({ summary: 'Send ticket details via email' })
  @ApiParam({ name: 'id', description: 'ID of the ticketed item', type: Number })
  @ApiQuery({ name: 'email', description: 'Recipient email address', type: String })
  @ApiResponse({ status: 200, description: 'Successfully sent the ticket details via email', type: Ticketed })
  @ApiResponse({ status: 404, description: 'Ticketed item not found' })
  @ApiResponse({ status: 400, description: 'Invalid email address' })

  
  async sendTicketEmail(@Param('id') id: number, @Query('email') recipientEmail: string): Promise<Ticketed> {
    const ticketData = await this.ticketedService.findOne(id);
    if (!ticketData) {
      throw new NotFoundException(`Ticket #${id} not found`);
    }

    await this.mailService.sendTicketEmail(ticketData, recipientEmail);

    return ticketData;
  }
}
