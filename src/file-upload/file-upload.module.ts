import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { FileUpload } from 'src/entities/file-upload.entity';
import { DebtCollection } from 'src/entities/debt-collection.entity';
import { DatabaseModule } from '@app/common';
import { DebtCollectionModule } from 'src/debt-collection/debt-collection.module';
import { ConfigModule } from '@nestjs/config';
import { FollowStatus } from 'src/entities/follow-status.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    DatabaseModule.forFeature([FileUpload, DebtCollection, FollowStatus]),
    MulterModule.register({
      dest: './uploads', // Path to save uploaded files
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype.match(
            /\/(jpg|jpeg|png|gif|pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)$/
          )
        ) {
          cb(null, true);
        } else {
          cb(new Error('Unsupported file type'), false);
        }
      },
    }),
    DebtCollectionModule,
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
