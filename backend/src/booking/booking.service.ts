import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from './entities/booking.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { MeetingRoomEntity } from 'src/meeting-room/entities/meeting-room.entity';
import { BookingStatus } from './entities/booking.entity';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import moment from 'moment';

@Injectable()
export class BookingService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>;

  @InjectRepository(MeetingRoomEntity)
  private readonly meetingRoomRepository: Repository<MeetingRoomEntity>;

  @InjectRepository(BookingEntity)
  private readonly bookingRepository: Repository<BookingEntity>;

  @Inject(EmailService)
  private readonly emailService: EmailService;
  async initData() {
    // 删除所有预定
    await this.entityManager.delete(BookingEntity, {});
    const user1 = await this.entityManager.findOneBy(UserEntity, {
      id: 4,
    });
    const user2 = await this.entityManager.findOneBy(UserEntity, {
      id: 3,
    });

    const room1 = await this.entityManager.findOneBy(MeetingRoomEntity, {
      id: 4,
    });
    const room2 = await await this.entityManager.findOneBy(MeetingRoomEntity, {
      id: 6,
    });

    const booking1 = new BookingEntity();
    booking1.meetingRoom = room1;
    booking1.attendees = [user1, user2];
    booking1.user = user1;
    booking1.startTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    booking1.endTime = moment(new Date(Date.now() + 1000 * 60 * 60)).format(
      'YYYY-MM-DD HH:mm:ss',
    );

    await this.entityManager.save(BookingEntity, booking1);

    const booking2 = new BookingEntity();
    booking2.meetingRoom = room2;
    booking2.attendees = [user1, user2];
    booking2.user = user2;
    booking2.startTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    booking2.endTime = moment(new Date(Date.now() + 1000 * 60 * 60)).format(
      'YYYY-MM-DD HH:mm:ss',
    );
    await this.entityManager.save(BookingEntity, booking2);

    const booking3 = new BookingEntity();
    booking3.meetingRoom = room1;
    booking3.attendees = [user1, user2];
    booking3.user = user2;
    booking3.startTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    booking3.endTime = moment(new Date(Date.now() + 1000 * 60 * 60)).format(
      'YYYY-MM-DD HH:mm:ss',
    );

    await this.entityManager.save(BookingEntity, booking3);

    const booking4 = new BookingEntity();
    booking4.meetingRoom = room2;
    booking4.user = user1;
    booking4.attendees = [user1, user2];
    booking4.startTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    booking4.endTime = moment(new Date(Date.now() + 1000 * 60 * 60)).format(
      'YYYY-MM-DD HH:mm:ss',
    );

    await this.entityManager.save(BookingEntity, booking4);
  }
  async create(createBookingDto: CreateBookingDto, user: UserEntity) {
    const { title, meetingRoomId, startTime, endTime, attendeeIds } =
      createBookingDto;
    // 会议室是否存在
    const meetingRoom = await this.meetingRoomRepository.findOneBy({
      id: meetingRoomId,
    });
    if (!meetingRoom) {
      throw new HttpException('会议室不存在', HttpStatus.NOT_FOUND);
    }
    // 参会人员是否存在
    const attendees = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...ids)', { ids: attendeeIds })
      .getMany();
    if (!attendees.length) {
      throw new HttpException('参会人员不存在', HttpStatus.NOT_FOUND);
    }
    // 预定时间是否冲突
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.meetingRoom = :meetingRoomId', { meetingRoomId })
      .andWhere(
        '(booking.startTime < :endTime AND booking.endTime > :startTime)',
        { startTime, endTime },
      )
      .getOne();
    if (booking) {
      throw new HttpException('预定时间冲突', HttpStatus.BAD_REQUEST);
    }
    const newBooking = new BookingEntity();
    newBooking.title = title;
    newBooking.startTime = startTime;
    newBooking.endTime = endTime;
    newBooking.user = user;
    newBooking.meetingRoom = meetingRoom;
    newBooking.attendees = attendees;
    await this.bookingRepository.insert(newBooking);
    // 发送邮件通知管理员
    const adminList = await this.userRepository.find({
      where: {
        isAdmin: true,
      },
    });
    adminList.forEach((item) => {
      this.emailService.send(
        item.email,
        title,
        `${meetingRoom.name}有新的预定，时间为${moment(startTime).format('YYYY-MM-DD hh:mm:ss')}至${moment(endTime).format('YYYY-MM-DD hh:mm:ss')}`,
      );
    });
    return newBooking;
  }

  async cancel(id: number) {
    const booking = await this.bookingRepository.findOneBy({ id });
    if (!booking) {
      throw new HttpException('预定不存在', HttpStatus.NOT_FOUND);
    }
    if (booking.status !== 0) {
      throw new HttpException('预定状态不正确', HttpStatus.BAD_REQUEST);
    }
    booking.status = BookingStatus.Canceled;
    await this.bookingRepository.update(id, booking);
    // 通知参会人员
    const { attendees, user, meetingRoom, startTime, endTime } = booking;
    const emailList = attendees.map((item) => item.email);
    emailList.push(user.email);
    emailList.forEach((email) => {
      this.emailService.send(
        email,
        '会议室预定取消',
        `您的预定${meetingRoom.name}，时间为${startTime}至${endTime}已被取消`,
      );
    });
    return booking;
  }

  async list(user: UserEntity, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const { id, isAdmin } = user;
    const [list, total] = await this.bookingRepository.findAndCount({
      take: pageSize,
      skip,
      where: isAdmin
        ? {}
        : {
            user: { id },
          },
      relations: ['user', 'meetingRoom', 'attendees'],
    });
    return { list, total };
  }

  async review(id: number, status: BookingStatus, userId: number) {
    const userEntity = await this.userRepository.findOneBy({ id: userId });
    if (!userEntity.isAdmin) {
      throw new HttpException('没有权限', HttpStatus.FORBIDDEN);
    }
    // const booking = await this.bookingRepository.findOne({
    //   where: { id },
    //   relations: ['user', 'meetingRoom', 'attendees'],
    // });
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.meetingRoom', 'meetingRoom')
      .leftJoinAndSelect('booking.attendees', 'attendees')
      .where('booking.id = :id', { id })
      .getOne();
    if (!booking) {
      throw new HttpException('预定不存在', HttpStatus.NOT_FOUND);
    }
    if (booking.status !== 0) {
      throw new HttpException('预定状态不正确', HttpStatus.BAD_REQUEST);
    }
    if (`${BookingStatus}`.includes(`${status}`)) {
      throw new HttpException('预定状态不正确', HttpStatus.BAD_REQUEST);
    }

    await this.bookingRepository.update(id, { status });
    const { attendees, user, meetingRoom, startTime, endTime, title } = booking;
    const emailList = attendees.map((item) => item.email);
    emailList.push(user.email);
    // 发送预定成功邮件通知
    if (status === BookingStatus.Confirmed) {
      this.emailService.send(
        user.email,
        '会议室预定成功',
        `您已成功预定${meetingRoom.name}，时间为${startTime}至${endTime}`,
      );
      emailList.forEach((email) => {
        this.emailService.send(
          email,
          '会议室预定成功',
          `您受邀参加${title}会议，地址为${meetingRoom.name}，时间为${startTime}至${endTime}`,
        );
      });
    }
    // 发送预定拒绝邮件通知
    if (status === BookingStatus.Rejected) {
      this.emailService.send(
        user.email,
        '会议室预定被拒绝',
        `您的预定${meetingRoom.name}，时间为${startTime}至${endTime}已被拒绝，请重新预定`,
      );
    }
    return booking;
  }

  async findUserById(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async urge(id: number, userId: number) {
    // 使用id和userId生成一个redis的key，防止重复催促
    const key = `urge_${id}_${userId}`;
    const value = await this.redisService.get(key);
    if (value) {
      throw new HttpException('请勿重复催促', HttpStatus.BAD_REQUEST);
    }
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['meetingRoom'],
    });
    if (!booking) {
      throw new HttpException('预定不存在', HttpStatus.NOT_FOUND);
    }
    const adminList = await this.userRepository.find({
      where: {
        isAdmin: true,
      },
    });
    adminList.forEach((item) => {
      this.emailService.send(
        item.email,
        '有人催促会议室预定',
        `${booking.meetingRoom.name}的预定${booking.title}有人催促，请及时处理`,
      );
    });
    this.redisService.set(key, '1', 60);
    return booking;
  }
}
