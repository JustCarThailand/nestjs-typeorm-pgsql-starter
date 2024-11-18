import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('APP_JWT_SECRET', { infer: true }),
        signOptions: {
          expiresIn: `${parseInt(configService.getOrThrow<number>('APP_JWT_EXPIRATION', { infer: true }))}s`,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
})
export class AuthModule {}
