import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Ticketed } from 'src/ticketed/entities/ticketed.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendTicketEmail(ticketed: Ticketed, recipientEmail: string) {
    const url = `etripzone.com/ticketed/${ticketed.id}`;
    

    await this.mailerService.sendMail({
      to: recipientEmail,
      subject: 'Your Ticket Details',
      template: './ticket-email', // `.hbs` extension is appended automatically
      context: {
        id: ticketed.id
      },
    });
  }
}
