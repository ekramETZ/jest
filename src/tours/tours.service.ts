import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tour } from './entities/tour.entity';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { Image } from './entities/tour_image.entity';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private readonly toursRepository: Repository<Tour>,
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
  ) {}

  async create(createTourDto: CreateTourDto): Promise<Tour> {
    const tour = new Tour();
    Object.assign(tour, createTourDto);

    if (createTourDto.images) {
      tour.images = createTourDto.images.map(url => {
        const image = new Image();
        image.url = url;
        return image;
      });
    }

    return await this.toursRepository.save(tour);
  }

  async findAll(): Promise<Tour[]> {
    return await this.toursRepository.find({ relations: ['images'] });
  }

  async findOne(id: number): Promise<Tour> {
    const tour = await this.toursRepository.findOne({ where: { id }, relations: ['images'] });
    if (!tour) {
      throw new NotFoundException(`Tour with ID ${id} not found`);
    }
    return tour;
  }

  async update(id: number, updateTourDto: UpdateTourDto): Promise<Tour> {
    const tour = await this.toursRepository.findOne({ where: { id }, relations: ['images'] });
    if (!tour) {
      throw new NotFoundException(`Tour with ID ${id} not found`);
    }

    Object.assign(tour, updateTourDto);

    if (updateTourDto.images) {
      tour.images = updateTourDto.images.map(url => {
        const image = new Image();
        image.url = url;
        image.tour = tour;
        return image;
      });
    }

    return await this.toursRepository.save(tour);
  }

  async remove(id: number): Promise<void> {
    const result = await this.toursRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tour with ID ${id} not found`);
    }
  }
  async updateImage(tourId: number, imageId: number, newUrl: string): Promise<Image> {
    const tour = await this.toursRepository.findOne({ where: { id: tourId }, relations: ['images'] });
    if (!tour) {
      throw new NotFoundException(`Tour with ID ${tourId} not found`);
    }

    const image = tour.images.find(image => image.id === imageId);
    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found in tour ${tourId}`);
    }

    image.url = newUrl;
    return await this.imagesRepository.save(image);
  }
}