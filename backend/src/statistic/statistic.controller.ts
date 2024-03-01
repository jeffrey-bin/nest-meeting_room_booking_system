import { Controller, Get, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('userBookingCount')
  userBookingCount(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    return this.statisticService.userBookingCount(startTime, endTime);
  }

  @Get('meetingRoomBookingCount')
  meetingRoomBookingCount(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    return this.statisticService.meetingRoomBookingCount(startTime, endTime);
  }
}
