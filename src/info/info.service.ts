import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Info } from './entities/info.entity';

@Injectable()
export class InfoService {
  constructor(
    @InjectRepository(Info)
    private infoRepository: Repository<Info>,
  ) {}

  findAll(): Promise<Info[]> {
    return this.infoRepository.find();
  }

  findOne(id: number): Promise<Info> {
    return this.infoRepository.findOneBy({ id });
  }

  async create(info: Info): Promise<Info> {
    return this.infoRepository.save(info);
  }

  async update(id: number, info: Info): Promise<Info> {
    await this.infoRepository.update(id, info);
    return this.infoRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.infoRepository.delete(id);
  }
}
