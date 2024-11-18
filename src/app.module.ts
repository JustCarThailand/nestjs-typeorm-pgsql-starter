import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DebtCollectionModule } from './debt-collection/debt-collection.module';
import { AuthModule } from './auth/auth.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { DatabaseModule } from '../libs/common/src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ValidateEnvSchema } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ValidateEnvSchema,
    }),
    DatabaseModule,
    DebtCollectionModule,
    AuthModule,
    FileUploadModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
