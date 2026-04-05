import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async apply(studentId: string, dto: CreateApplicationDto) {
    const student = await this.prisma.user.findUnique({ where: { id: studentId } });
    if (!student || student.role !== 'STUDENT') {
      throw new ForbiddenException('Only students can apply to jobs');
    }

    const activeApplicationsCount = await this.prisma.application.count({
      where: {
        studentId,
        status: 'PENDING',
      },
    });

    if (activeApplicationsCount >= 3) {
      throw new ForbiddenException(
        'Student can only have 3 active applications at a time',
      );
    }

    const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.companyId === studentId) {
      throw new ForbiddenException('You cannot apply to your own job posting');
    }

    const existing = await this.prisma.application.findFirst({
      where: { studentId, jobId: dto.jobId },
    });
    if (existing) {
      throw new ForbiddenException('You have already applied for this job');
    }

    return this.prisma.application.create({
      data: {
        studentId,
        jobId: dto.jobId,
        resumeUrl: dto.resumeUrl,
        motivation: dto.motivation,
      },
      include: {
        job: true,
      },
    });
  }

  async getMyApplications(studentId: string) {
    return this.prisma.application.findMany({
      where: { studentId },
      include: {
        job: {
          include: {
            company: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getApplicationsForCompany(companyId: string) {
    return this.prisma.application.findMany({
      where: { job: { companyId } },
      include: {
        student: { select: { id: true, firstName: true, lastName: true, email: true } },
        job: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(applicationId: string, companyId: string, dto: UpdateApplicationStatusDto) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true, student: true },
    });

    if (!application) throw new NotFoundException('Application not found');
    if (application.job.companyId !== companyId) {
      throw new ForbiddenException('You are not authorized to update this application');
    }

    if (dto.status === 'REJECTED' && !dto.companyResponse?.trim()) {
      throw new ForbiddenException('Decline explanation is required');
    }

    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status: dto.status,
        companyResponse: dto.companyResponse,
      },
      include: { job: true },
    });

    const notificationMessage =
      dto.status === 'ACCEPTED'
        ? `Your application for \"${application.job.title}\" was accepted. ${dto.companyResponse}`
        : `Your application for \"${application.job.title}\" was rejected. Reason: ${dto.companyResponse}`;

    await this.notificationsService.createNotification(
      application.studentId,
      'Application update',
      notificationMessage,
    );

    return updated;
  }
}
