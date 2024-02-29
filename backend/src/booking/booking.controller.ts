import { Controller, Get, Post, Body } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RequiredLogin, UserInfo } from 'src/custom.decorator';
import { BookingStatus } from './entities/booking.entity';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('user/create')
  @RequiredLogin()
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @UserInfo('userId') userId: number,
  ) {
    //通过userId获取用户信息
    const user = await this.bookingService.findUserById(userId);
    return this.bookingService.create(createBookingDto, user);
  }

  @Post('user/cancel')
  @RequiredLogin()
  async cancel(@Body('id') id: number) {
    return this.bookingService.cancel(id);
  }

  @Get('list')
  @RequiredLogin()
  async list(
    @UserInfo('userId') userId: number,
    page: number = 1,
    pageSize: number = 10,
  ) {
    //通过userId获取用户信息
    const user = await this.bookingService.findUserById(userId);
    return this.bookingService.list(user, page, pageSize);
  }

  @Post('admin/review')
  @RequiredLogin()
  async review(
    @Body('id') id: number,
    @Body('status') status: BookingStatus,
    @UserInfo('userId') userId: number,
  ) {
    return this.bookingService.review(id, status, userId);
  }

  @Post('user/urge')
  @RequiredLogin()
  async urge(@Body('id') id: number, @UserInfo('userId') userId: number) {
    return this.bookingService.urge(id, userId);
  }
}
