import { Module } from '@nestjs/common';
import { DebtCollectionService } from './debt-collection.service';
import { DebtCollectionController } from './debt-collection.controller';
import { DatabaseModule } from '@app/common';
import { DebtCollection } from 'src/entities/debt-collection.entity';
import { FollowStatus } from 'src/entities/follow-status.entity';
import { ConfigModule } from '@nestjs/config';
import { FileUpload } from 'src/entities/file-upload.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    DatabaseModule.forFeature([DebtCollection, FollowStatus, FileUpload]),
  ],
  controllers: [DebtCollectionController],
  providers: [DebtCollectionService],
  exports: [DebtCollectionService],
})
export class DebtCollectionModule {}
