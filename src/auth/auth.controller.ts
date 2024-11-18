import { Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, LocalAuthGuard } from '@app/common';
import { ApiBody, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UsersService } from './users/users.service';
import { Response } from 'express';
import { User } from 'src/entities/user.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: LoginDto,
    description: 'This is the login endpoint with example of username and password to login',
  })
  @ApiOkResponse({
    description: 'User logged in successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  async login(@CurrentUser() users: User, @Res({ passthrough: true }) response: Response) {
    const jwt = await this.authService.login(users, response);
    response.send({ accessToken: jwt.accessToken, user: jwt.user });
  }
}
