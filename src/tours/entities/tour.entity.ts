import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Image } from './tour_image.entity';

@Entity()
export class Tour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('decimal')
  priceSingle: number;

  @Column('decimal')
  priceDouble: number;

  @Column('decimal')
  priceTwin: number;

  @Column('decimal')
  priceTriple: number;

  @Column('decimal')
  priceChild3to6: number;

  @Column('decimal')
  priceChild7to12: number;

  @Column()
  location: string;

  @Column('date')
  startDate: Date;

  @Column('date')
  endDate: Date;

  @Column('simple-array')
  itinerary: string[];

  @Column()
  pickupNote: string;

  @Column()
  cancellationPolicy: string;

  @Column()
  tax: string;

  @Column()
  includedService: string;

  @Column()
  excludedService: string;

  @Column()
  highlights: string;

  @Column()
  generalCondition: string;

  @Column()
  emiDetails: string;

  @OneToMany(() => Image, image => image.tour, { cascade: true })
  images: Image[];
}
