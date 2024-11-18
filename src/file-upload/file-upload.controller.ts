import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileUpload } from 'src/entities/file-upload.entity';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { Response } from 'express';

const filePath = join(__dirname, '..', 'uploads');

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('file/:debtCollectionId')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'debtCollectionId', required: true, type: Number })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: filePath,
        filename: (req, file, cb) => {
          const fileExt = extname(file.originalname);
          const filename = `${Date.now()}${fileExt}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only JPG, JPEG, and PNG files are allowed!'), false);
        }
        cb(null, true);
      },
    })
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The file has been successfully uploaded.',
    type: FileUpload,
  })
  @ApiResponse({ status: 404, description: 'DebtCollection not found.' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('debtCollectionId') debtCollectionId: number
  ): Promise<FileUpload> {
    return this.fileUploadService.uploadFile(file.filename, file.mimetype, debtCollectionId);
  }

  @Get(':id')
  async getImage(@Param('id') id: number, @Res() res: Response) {
    const img = await this.fileUploadService.getImage(id);
    if (fs.existsSync(img.filePath)) {
      res.sendFile(img.filePath);
    } else {
      throw new BadRequestException('Image not found');
    }
  }

  @Delete(':id')
  async deleteImage(@Param('id') id: number) {
    return await this.fileUploadService.deleteImage(id);
  }
}
