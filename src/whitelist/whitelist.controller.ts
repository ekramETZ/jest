import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { WhitelistService } from './whitelist.service';
import { Whitelist } from './entities/whitelist.entity';

@ApiTags('whitelist')
@Controller('whitelist')
export class WhitelistController {
  constructor(private readonly whitelistService: WhitelistService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new whitelist entry' })
  @ApiBody({ description: 'Data for creating a whitelist entry', type: Whitelist })
  @ApiResponse({ status: 201, description: 'The whitelist entry has been successfully created.', type: Whitelist })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() data: { ipAddress: string }): Promise<Whitelist> {
    return this.whitelistService.create(data.ipAddress);
  }

  @Get()
  @ApiOperation({ summary: 'Get all whitelist entries' })
  @ApiResponse({ status: 200, description: 'Return all whitelist entries.', type: [Whitelist] })
  @ApiResponse({ status: 404, description: 'No whitelist entries found.' })
  async findAll(): Promise<Whitelist[]> {
    return this.whitelistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a whitelist entry by ID' })
  @ApiParam({ name: 'id', description: 'ID of the whitelist entry to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the whitelist entry.', type: Whitelist })
  @ApiResponse({ status: 404, description: 'Whitelist entry not found.' })
  async findOne(@Param('id') id: string): Promise<Whitelist> {
    return this.whitelistService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a whitelist entry by ID' })
  @ApiParam({ name: 'id', description: 'ID of the whitelist entry to update' })
  @ApiBody({ description: 'Data for updating the whitelist entry', type: Whitelist })
  @ApiResponse({ status: 200, description: 'The whitelist entry has been successfully updated.', type: Whitelist })
  @ApiResponse({ status: 404, description: 'Whitelist entry not found.' })
  async update(@Param('id') id: string, @Body() data: { ipAddress: string }): Promise<Whitelist> {
    return this.whitelistService.update(+id, data.ipAddress);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a whitelist entry by ID' })
  @ApiParam({ name: 'id', description: 'ID of the whitelist entry to delete' })
  @ApiResponse({ status: 204, description: 'The whitelist entry has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Whitelist entry not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.whitelistService.remove(+id);
  }
}
