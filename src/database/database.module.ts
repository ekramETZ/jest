import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Agents } from '../agents/entities/agent.entity';
import { Ticketed } from '../ticketed/entities/ticketed.entity';
import { Bookings } from '../bookings/entities/booking.entity';
import { Info } from '../info/entities/info.entity';
import { Whitelist } from '../whitelist/entities/whitelist.entity';
import { Tour } from '../tours/entities/tour.entity';
import { Image } from '../tours/entities/tour_image.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          Agents,
          Ticketed,
          Bookings,
          Info,
          Whitelist,
          Tour,
          Image,
        ],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      Agents,
      Ticketed,
      Bookings,
      Info,
      Whitelist,
      Tour,
      Image,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}