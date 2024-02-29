import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MeetingRoomEntity } from './entities/meeting-room.entity';
import { BookingEntity } from 'src/booking/entities/booking.entity';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoomEntity)
  private readonly meetingRoomRepository: Repository<MeetingRoomEntity>;

  @InjectRepository(BookingEntity)
  private readonly bookingRepository: Repository<BookingEntity>;

  async add(createMeetingRoomDto: CreateMeetingRoomDto) {
    // 检查同名会议室
    const meetingRoom = await this.meetingRoomRepository.findOneBy({
      name: createMeetingRoomDto.name,
    });
    if (meetingRoom) {
      throw new HttpException('会议室已存在', HttpStatus.BAD_REQUEST);
    }
    const newMeetingRoom = this.meetingRoomRepository.create({
      ...createMeetingRoomDto,
      status: 1,
    });
    await this.meetingRoomRepository.insert(newMeetingRoom);
    return newMeetingRoom;
  }

  async list(page: number, pageSize: number, name: string, status: number) {
    const skip = (page - 1) * pageSize;
    const condition: Record<string, any> = {};
    if (name) {
      condition.name = Like(`%${name}%`);
    }
    if (status) {
      condition.status = status;
    }
    const [list, total] = await this.meetingRoomRepository.findAndCount({
      where: condition,
      skip,
      take: pageSize,
    });
    return {
      list,
      total,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} meetingRoom`;
  }

  async update(updateMeetingRoomDto: UpdateMeetingRoomDto) {
    const { id, ...rest } = updateMeetingRoomDto;
    const meetingRoom = await this.meetingRoomRepository.findOneBy({ id });
    if (!meetingRoom) {
      throw new HttpException('会议室不存在', HttpStatus.BAD_REQUEST);
    }
    meetingRoom.name = rest.name || meetingRoom.name;
    meetingRoom.address = rest.address || meetingRoom.address;
    meetingRoom.capacity = rest.capacity || meetingRoom.capacity;
    meetingRoom.description = rest.description || meetingRoom.description;

    this.meetingRoomRepository.update(id, meetingRoom);
    return meetingRoom;
  }

  async remove(id: number) {
    if (!id) {
      throw new HttpException('id不能为空', HttpStatus.BAD_REQUEST);
    }
    const meetingRoom = await this.meetingRoomRepository.findOneBy({ id });
    if (!meetingRoom) {
      throw new HttpException('会议室不存在', HttpStatus.BAD_REQUEST);
    }
    // 检查会议室是否有预定
    const booking = await this.bookingRepository.findOneBy({
      meetingRoom,
      status: 0,
    });
    if (booking) {
      throw new HttpException('会议室有预定，不能删除', HttpStatus.BAD_REQUEST);
    }

    await this.meetingRoomRepository.delete({ id });
    return '删除成功';
  }
}
