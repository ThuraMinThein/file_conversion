import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body('courseId') courseId: number,
  ) {
    return this.appService.create(courseId, file);
  }
}
