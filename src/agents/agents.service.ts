import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agents } from './entities/agent.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agents)
    private agentsRepository: Repository<Agents>,
  ) {}

  findAll(): Promise<Agents[]> {
    return this.agentsRepository.find();
  }

  async findOne(id: number): Promise<Agents> {
    const agent = await this.agentsRepository.findOne({ where: { id } });
    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    return agent;
  }

  create(createAgentDto: CreateAgentDto): Promise<Agents> {
    const agent = this.agentsRepository.create(createAgentDto);
    return this.agentsRepository.save(agent);
  }

  async update(id: number, updateAgentDto: UpdateAgentDto): Promise<void> {
    const result = await this.agentsRepository.update(id, updateAgentDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.agentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
  }
}
