import 'multer';
import { Express } from 'express';
import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeValidationPipe, MongoIdValidationPipe } from '@project/pipes';
import { FileUploaderService } from './file-uploader.service';
import { UploadedFileRdo } from '../rdo/uploaded-file.rdo';
import { fillDto } from '@project/helpers';

const ALLOWED_FILE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

@Controller('files')
export class FileUploaderController {
  constructor(private readonly fileUploaderService: FileUploaderService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE_BYTES } }))
  public async uploadFile(
    @UploadedFile(new FileTypeValidationPipe(ALLOWED_FILE_EXTENSIONS)) file: Express.Multer.File
  ) {
    const fileEntity = await this.fileUploaderService.saveFile(file);
    return fillDto(UploadedFileRdo, fileEntity.toPOJO());
  }

  @Get(':fileId')
  public async show(@Param('fileId', MongoIdValidationPipe) fileId: string) {
    const existFile = await this.fileUploaderService.getFile(fileId);
    return fillDto(UploadedFileRdo, existFile);
  }
}
