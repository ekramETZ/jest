import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Whitelist } from './entities/whitelist.entity';

@Injectable()
export class WhitelistService {
  constructor(
    @InjectRepository(Whitelist)
    private readonly whitelistRepository: Repository<Whitelist>,
  ) {}

  async create(ipAddress: string): Promise<Whitelist> {
    const whitelist = this.whitelistRepository.create({ ipAddress });
    return this.whitelistRepository.save(whitelist);
  }

  async findAll(): Promise<Whitelist[]> {
    return this.whitelistRepository.find();
  }

  async findOne(id: number): Promise<Whitelist> {
    return this.whitelistRepository.findOne({ where: { id } });
  }

  async update(id: number, ipAddress: string): Promise<Whitelist> {
    const whitelist = await this.whitelistRepository.findOne({ where: { id } });
    if (!whitelist) {
      throw new Error('Whitelist not found');
    }
    whitelist.ipAddress = ipAddress;
    return this.whitelistRepository.save(whitelist);
  }

  async remove(id: number): Promise<void> {
    await this.whitelistRepository.delete(id);
  }
}
