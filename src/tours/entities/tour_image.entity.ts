import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Tour } from './tour.entity';

@Entity('tour_img')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Tour, tour => tour.images)
  tour: Tour;
}
