import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const res = exception.getResponse() as {
      message: string[] | string;
      statusCode: number;
    };

    const status = exception.getStatus();

    response.json({
      code: status,
      message:
        Array.isArray(res.message) && res.message.length > 0
          ? res.message.join(', ')
          : exception.message,
      data: null,
    });
  }
}
