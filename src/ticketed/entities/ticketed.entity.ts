import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ticketed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agentId: string;

  @Column()
  bookingId: string;

  @Column()
  system: string;

  @Column()
  vendor: string;

  @Column()
  airlines: string;

  @Column()
  bookingpnr: string;

  @Column()
  airlinespnr: string;

  @Column()
  givenname: string;

  @Column()
  surname: string;

  @Column()
  ticketnumber: string;

  @Column()
  issuetype: string;

  @Column()
  uid: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;
}
