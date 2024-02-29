import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import moment from 'moment';
export enum MeetingRoomStatus {
  ENABLE = 1, // 可用
  DISABLE = 0, // 不可用
}

@Entity('meeting-room')
export class MeetingRoomEntity {
  @PrimaryGeneratedColumn({ comment: '会议室ID' })
  id: number;

  @Column({ comment: '会议室名称' })
  name: string;

  @Column({ comment: '会议室地址' })
  address: string;

  @Column({ comment: '会议室容量' })
  capacity: number;

  @Column({ comment: '会议室描述', nullable: true })
  description: string;

  @Column({ comment: '会议室状态' })
  status: MeetingRoomStatus;

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

  @AfterLoad()
  afterLoad() {
    this.createTime = moment(this.createTime).format('YYYY-MM-DD HH:mm:ss');
    this.updateTime = moment(this.updateTime).format('YYYY-MM-DD HH:mm:ss');
  }
}
