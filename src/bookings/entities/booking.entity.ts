import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Bookings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookingId: string;

  @Column()
  agentId: string;

  @Column()
  system: string;

  @Column()
  triptype: string;

  @Column()
  pnr: string;

  @Column()
  airlinespnr: string;

  @Column()
  carrier_name: string;

  @Column()
  carrier_code: string;

  @Column()
  depfrom: string;

  @Column()
  arrto: string;

  @Column()
  refundable: boolean;

  @Column()
  issue_permit: string;

  @Column()
  instant_payment: boolean;

  @Column()
  status: string;

  @Column()
  payment_status: string;

  @Column()
  grossfare: number;

  @Column()
  netfare: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  adultcount: number;

  @Column()
  childcount: number;

  @Column()
  infantcount: number;

  @Column()
  totalpax: number;

  @Column()
  totalsegment: number;

  @Column()
  ticketcopy: string;

  @Column()
  purchaseprice: number;

  @Column()
  sellprice: number;

  @Column()
  comission: number;

  @Column()
  flightdate: Date;

  @Column()
  timelimit: Date;
  
  @Column('json')
  itenary: Record<string, any>;  

  @Column()
  flightdata: string;

  @Column()
  companyname: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column()
  uid: string;
}
