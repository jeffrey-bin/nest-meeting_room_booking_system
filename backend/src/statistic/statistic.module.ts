import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from 'src/booking/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity])],
  providers: [StatisticService],
  controllers: [StatisticController],
})
export class StatisticModule {}
