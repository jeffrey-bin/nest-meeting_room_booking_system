import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import moment from 'moment';

export class CreateBookingDto {
  @IsNotEmpty({ message: '会议主题不能为空' })
  title: string;
  @IsNotEmpty({ message: '会议室不能为空' })
  meetingRoomId: number;
  @IsNotEmpty({ message: '开始时间不能为空' })
  @Transform(({ value }) => (value ? moment(value).toDate() : null))
  startTime: string;

  @IsNotEmpty({ message: '结束时间不能为空' })
  @Transform(({ value }) => (value ? moment(value).toDate() : null))
  endTime: string;

  @IsNotEmpty({ message: '参会人员不能为空' })
  attendeeIds: number[];
}
