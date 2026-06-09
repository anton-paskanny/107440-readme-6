import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { NotifyService } from '@project/account-notify';

import { MongoIdValidationPipe } from '@project/pipes';
import { fillDto } from '@project/helpers';

import { AuthenticationService } from './authentication.service';
import { SignUpUserDto } from '../dto/signup-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';

import { LoggedUserRdo } from '../rdo/logged-user.rdo';
import { UserRdo } from '../rdo/user.rdo';
import { AuthenticationResponseMessage } from './authentication.constant';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RequestWithUser } from './request-with-user.interface';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { RequestWithTokenPayload } from './request-with-token-payload.interface';
import { UserAvatarDto } from '../dto/user-avatar.dto';
import { UserAvatarQuery } from './user-avatar.query';

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly notifyService: NotifyService
  ) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: AuthenticationResponseMessage.UserCreated,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: AuthenticationResponseMessage.UserExist,
  })
  @Post('signup')
  public async signup(@Body() dto: SignUpUserDto) {
    const newUser = await this.authService.register(dto);

    const { email, firstname, lastname } = newUser;
    await this.notifyService.registerSubscriber({ email, firstname, lastname });

    return newUser.toPOJO();
  }

  @ApiResponse({
    type: LoggedUserRdo,
    status: HttpStatus.OK,
    description: AuthenticationResponseMessage.LoggedSuccess,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthenticationResponseMessage.LoggedError,
  })
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  public async signin(@Req() { user }: RequestWithUser) {
    const userToken = await this.authService.createUserToken(user);

    return fillDto(LoggedUserRdo, { ...user.toPOJO(), ...userToken });
  }

  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: AuthenticationResponseMessage.UserFound,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AuthenticationResponseMessage.UserNotFound,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async show(@Param('id', MongoIdValidationPipe) id: string) {
    const existUser = await this.authService.getUserById(id);
    return existUser.toPOJO();
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: AuthenticationResponseMessage.CurrentPasswordError,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/changePassword')
  public async changePassword(
    @Req() { user }: RequestWithTokenPayload,
    @Body() dto: ChangePasswordDto
  ) {
    const updatedUser = await this.authService.changePassword(user.sub, dto);
    return updatedUser.toPOJO();
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get a new access/refresh tokens',
  })
  public async refreshToken(@Req() { user }: RequestWithUser) {
    return this.authService.createUserToken(user);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(JwtAuthGuard)
  @Post('check')
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload) {
    return payload;
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(JwtAuthGuard)
  @Patch('avatar')
  public async uploadAvatar(
    @Body() body: UserAvatarDto,
    @Query() query: UserAvatarQuery
  ) {
    const updatedUser = await this.authService.addAvatar(
      body.avatar,
      query.userId
    );

    return fillDto(UserRdo, updatedUser.toPOJO());
  }
}
