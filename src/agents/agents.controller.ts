import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Agents } from './entities/agent.entity';

@ApiTags('Agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly AgentsService: AgentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new agent' })
  @ApiBody({ type: CreateAgentDto })
  @ApiResponse({ status: 201, description: 'The created agent', type: Agents })
  create(@Body() createAgentDto: CreateAgentDto): Promise<Agents> {
    return this.AgentsService.create(createAgentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all agents' })
  @ApiResponse({ status: 200, description: 'List of agents', type: [Agents] })
  findAll(): Promise<Agents[]> {
    return this.AgentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an agent by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'The found agent', type: Agents })
  findOne(@Param('id') id: number): Promise<Agents> {
    return this.AgentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an agent' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateAgentDto })
  @ApiResponse({ status: 200, description: 'The updated agent' })
  update(@Param('id') id: number, @Body() updateAgentDto: UpdateAgentDto): Promise<void> {
    return this.AgentsService.update(id, updateAgentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.AgentsService.remove(id);
  }
}
