import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { BookingEntity } from 'src/booking/entities/booking.entity';
import { MeetingRoomEntity } from 'src/meeting-room/entities/meeting-room.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatisticService {
  @InjectRepository(BookingEntity)
  private bookingRepository: Repository<BookingEntity>;

  async userBookingCount(startTime: string, endTime: string) {
    return await this.bookingRepository
      .createQueryBuilder('booking')
      .select('user.id', 'userId')
      .addSelect('user.userName', 'userName')
      .leftJoin(UserEntity, 'user', 'user.id = booking.userId')
      .addSelect('COUNT(booking.id)', 'bookingCount')
      .where('booking.startTime >= :startTime', {
        startTime: moment(startTime || moment().toDate()).toDate(),
      })
      .andWhere('booking.endTime <= :endTime', {
        // 默认值当前时间+1天
        endTime: moment(endTime || moment().add(1, 'day')).toDate(),
      })
      .groupBy('booking.userId')
      .getRawMany();
  }
  async meetingRoomBookingCount(startTime: string, endTime: string) {
    return await this.bookingRepository
      .createQueryBuilder('booking')
      .select('meetingRoom.id', 'meetingRoomId')
      .addSelect('meetingRoom.name', 'meetingRoomName')
      .leftJoin(
        MeetingRoomEntity,
        'meetingRoom',
        'meetingRoom.id = booking.meetingRoomId',
      )
      .addSelect('COUNT(booking.id)', 'bookingCount')
      .where('booking.startTime >= :startTime', {
        startTime: moment(startTime || moment().toDate()).toDate(),
      })
      .andWhere('booking.endTime <= :endTime', {
        // 默认值当前时间+1天
        endTime: moment(endTime || moment().add(1, 'day')).toDate(),
      })
      .groupBy('booking.meetingRoomId')
      .getRawMany();
  }
}
