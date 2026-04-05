import { Body, Controller, Get, Patch, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { JwtService } from 'src/auth/jwt.service';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('me')
  async getMe(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['jwt'];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findUserById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateUser(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(user.id, updateUserDto);
  }
}
