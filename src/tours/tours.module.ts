import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ToursController],
  providers: [ToursService],
  exports: [ToursService],
})
export class ToursModule {}
