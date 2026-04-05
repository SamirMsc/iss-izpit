import { Controller, Post, Body, UseGuards, Req, Res, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, ForgotPasswordDto, LoginDto, UpdatePasswordDto } from './dto';
import { JwtAuthGuard } from './guard/jwt.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  async signin(@Body() dto: LoginDto, @Res() res: Response) {
    return this.authService.signin(dto, res);
  }

  @Post('signout')
  async signout(@Req() req: Request, @Res() res: Response) {
    return this.authService.signout(req, res);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-password')
  async updatePassword(@Req() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.updatePassword(req.user.id, updatePasswordDto);
  }
}
