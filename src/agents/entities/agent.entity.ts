import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Agents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agentId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  company: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  password: string;

  @Column()
  status: string;

  @Column()
  logo: string;

  @Column('decimal')
  credit: number;

  @Column()
  markuptype: string;

  @Column('decimal')
  markup: number;

  @Column()
  clientmarkuptype: string;

  @Column('decimal')
  clientmarkup: number;

  @Column()
  todaysearch: number;

  @Column()
  searchlimit: number;

  @Column()
  nid: string;

  @Column()
  tradelicense: string;

  @Column()
  civilaviationno: string;

  @Column()
  uid: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;
}
