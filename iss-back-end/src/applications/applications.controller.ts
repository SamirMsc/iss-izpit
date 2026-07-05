import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: join(
        process.cwd(),
        'uploads',
        'resumes',
      ),

        filename: (
          req,
          file,
          callback,
        ) => {
          const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}`;

          const extension = extname(file.originalname);

          callback(
            null,
            `${uniqueName}${extension}`,
          );
        },
      }),
    }),
  )
  async apply(
    @GetUser() user: User,
    @Body() dto: CreateApplicationDto,
    @UploadedFile() resume: Express.Multer.File,
  ) {
    if (!resume) {
      throw new BadRequestException(
        'Resume file is required.',
      );
    }

    const data = {
      ...dto,
      resumeUrl: `/uploads/resumes/${resume.filename}`,
    };

    return this.applicationsService.apply(
      user.id,
      data,
    );
  }

  @Get('me')
  async getMyApplications(
    @GetUser() user: User,
  ) {
    return this.applicationsService.getMyApplications(
      user.id,
    );
  }

  @Get('company')
  async getApplicationsForCompany(
    @GetUser() user: User,
  ) {
    return this.applicationsService.getApplicationsForCompany(
      user.id,
    );
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(
      id,
      user.id,
      dto,
    );
  }
}