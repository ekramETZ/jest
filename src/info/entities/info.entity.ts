import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Info {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  about_info: string;

  @Column({ type: 'longtext' })
  about_description: string;

  @Column()
  contact_phone: string;

  @Column()
  contact_email: string;

  @Column()
  reservation_phone: string;

  @Column()
  reservation_email: string;

  @Column()
  account_phone: string;

  @Column()
  account_email: string;

  @Column()
  contact_whatsapp: string;

  @Column()
  instagram: string;

  @Column()
  facebook: string;

  @Column()
  linkedin: string;

  @Column()
  twitter: string;

  @Column()
  messenger: string;

  @Column()
  youtube: string;

  @Column({ type: 'longtext' })
  terms_condition: string;

  @Column()
  office_address1: string;

  @Column()
  office_address2: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
