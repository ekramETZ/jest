import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketedDto } from './create-ticketed.dto';

export class UpdateTicketedDto extends PartialType(CreateTicketedDto) {}
