import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { Tour } from './entities/tour.entity';
import { Image } from './entities/tour_image.entity';

@ApiTags('tours')
@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tour' })
  @ApiResponse({ status: 201, description: 'The tour has been successfully created.', type: Tour })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(@Body() createTourDto: CreateTourDto) {
    return await this.toursService.create(createTourDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tours' })
  @ApiResponse({ status: 200, description: 'Returns a list of all tours.', type: [Tour] })
  async findAll() {
    return await this.toursService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific tour by ID' })
  @ApiResponse({ status: 200, description: 'Returns the details of a specific tour.', type: Tour })
  @ApiResponse({ status: 404, description: 'Tour not found.' })
  async findOne(@Param('id') id: string) {
    return await this.toursService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific tour by ID' })
  @ApiResponse({ status: 200, description: 'The tour has been successfully updated.', type: Tour })
  @ApiResponse({ status: 404, description: 'Tour not found.' })
  async update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
    await this.toursService.update(+id, updateTourDto);
    return { message: 'Tour updated successfully' };
  }

  @Patch(':tourId/images/:imageId')
  @ApiOperation({ summary: 'Update an image of a specific tour by IDs' })
  @ApiResponse({ status: 200, description: 'The image has been successfully updated.', type: Image })
  @ApiResponse({ status: 404, description: 'Tour or image not found.' })
  async updateImage(
    @Param('tourId') tourId: string,
    @Param('imageId') imageId: string,
    @Body('url') newUrl: string
  ) {
    await this.toursService.updateImage(+tourId, +imageId, newUrl);
    return { message: 'Image updated successfully' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific tour by ID' })
  @ApiResponse({ status: 200, description: 'The tour has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Tour not found.' })
  async remove(@Param('id') id: string) {
    await this.toursService.remove(+id);
    return { message: 'Tour removed successfully' };
  }
}
