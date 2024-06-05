import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Whitelist {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the whitelist entry.' })
  id: number;

  @Column()
  @ApiProperty({ description: 'The IP address to whitelist.' })
  ipAddress: string;
}
