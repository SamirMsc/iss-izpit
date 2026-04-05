import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  async apply(@GetUser() user: User, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.apply(user.id, dto);
  }

  @Get('me')
  async getMyApplications(@GetUser() user: User) {
    return this.applicationsService.getMyApplications(user.id);
  }

  @Get('company')
  async getApplicationsForCompany(@GetUser() user: User) {
    return this.applicationsService.getApplicationsForCompany(user.id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(id, user.id, dto);
  }
}
