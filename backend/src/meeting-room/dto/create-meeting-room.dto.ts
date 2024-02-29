import { IsNotEmpty } from 'class-validator';

export class CreateMeetingRoomDto {
  @IsNotEmpty({
    message: '会议室名称不能为空',
  })
  name: string;

  @IsNotEmpty({
    message: '会议室地址不能为空',
  })
  address: string;

  @IsNotEmpty({
    message: '会议室容纳人数不能为空',
  })
  capacity: number;

  description: string;
}
