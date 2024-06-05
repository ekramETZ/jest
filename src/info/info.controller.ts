import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { InfoService } from './info.service';
import { Info } from './entities/info.entity';

@ApiTags('info')
@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Get()
  @ApiOperation({ summary: 'Get all info pages' })
  @ApiResponse({ status: 200, description: 'Successfully fetched all info pages.', type: [Info] })
  findAll() {
    return this.infoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single info page by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the info page' })
  @ApiResponse({ status: 200, description: 'Successfully fetched the info page.', type: Info })
  @ApiResponse({ status: 404, description: 'Info page not found' })
  findOne(@Param('id') id: string) {
    return this.infoService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new info page' })
  @ApiBody({ type: Info, description: 'The info page data' })
  @ApiResponse({ status: 201, description: 'Successfully created a new info page.', type: Info })
  create(@Body() info: Info) {
    return this.infoService.create(info);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing info page by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the info page' })
  @ApiBody({ type: Info, description: 'The updated info page data' })
  @ApiResponse({ status: 200, description: 'Successfully updated the info page.', type: Info })
  @ApiResponse({ status: 404, description: 'Info page not found' })
  update(@Param('id') id: string, @Body() info: Info) {
    return this.infoService.update(+id, info);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an info page by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the info page' })
  @ApiResponse({ status: 200, description: 'Successfully deleted the info page.' })
  @ApiResponse({ status: 404, description: 'Info page not found' })
  remove(@Param('id') id: string) {
    return this.infoService.remove(+id);
  }
}
