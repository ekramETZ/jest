import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticketed } from './entities/ticketed.entity';
import { CreateTicketedDto } from './dto/create-ticketed.dto';

@Injectable()
export class TicketedService {
  constructor(
    @InjectRepository(Ticketed)
    private readonly ticketedRepository: Repository<Ticketed>,
  ) {}

  async findAll(): Promise<Ticketed[]> {
    return this.ticketedRepository.find();
  }

  async findOne(id: number): Promise<Ticketed> {
    return this.ticketedRepository.findOne({ where: { id } });
  }

  async create(createTicketedDto: CreateTicketedDto): Promise<Ticketed> {
    const ticketed = this.ticketedRepository.create(createTicketedDto);
    return this.ticketedRepository.save(ticketed);
  }

  async update(id: number, updateTicketedDto: Partial<Ticketed>): Promise<void> {
    await this.ticketedRepository.update(id, updateTicketedDto);
  }

  async remove(id: number): Promise<void> {
    await this.ticketedRepository.delete(id);
  }
}
