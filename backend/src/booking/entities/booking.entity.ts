import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from 'src/user/entities/user.entity';
import { MeetingRoomEntity } from 'src/meeting-room/entities/meeting-room.entity';

export enum BookingStatus {
  Pending = 0,
  Confirmed = 1,
  Canceled = 2,
  Rejected = 3,
}

@Entity('booking')
export class BookingEntity {
  @PrimaryGeneratedColumn({
    comment: '订单id',
  })
  id: number;

  @Column({
    comment: '订单标题',
    default: '会议室预定',
  })
  title: string;

  @Column({
    comment: '预定开始时间',
  })
  startTime: string;

  @Column({
    comment: '预定结束时间',
  })
  endTime: string;

  @Column({
    comment: '预定状态',
    default: BookingStatus.Pending,
  })
  status: number;

  @CreateDateColumn({
    comment: '创建时间',
    type: 'timestamp',
  })
  createTime: string;

  @UpdateDateColumn({
    comment: '更新时间',
    type: 'timestamp',
  })
  updateTime: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'booking_attendees',
    joinColumn: {
      name: 'booking_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  attendees: UserEntity[];

  @ManyToOne(() => MeetingRoomEntity)
  meetingRoom: MeetingRoomEntity;
}
