import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, dto: CreateJobDto) {
    const company = await this.prisma.user.findUnique({ where: { id: companyId } });
    if (!company || company.role !== 'COMPANY') {
      throw new ForbiddenException('Only companies can create jobs');
    }

    return this.prisma.job.create({
      data: { ...dto, companyId },
    });
  }

  async findAll() {
    return this.prisma.job.findMany({
      include: {
        company: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: { select: { id: true, firstName: true, lastName: true, email: true } },
        applications: true,
      },
    });

    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async findMyJobs(companyId: string) {
    return this.prisma.job.findMany({
      where: { companyId },
      include: { applications: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, companyId: string, dto: UpdateJobDto) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.companyId !== companyId) throw new ForbiddenException('You are not allowed to update this job');

    return this.prisma.job.update({ where: { id }, data: dto });
  }

  async remove(id: string, companyId: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.companyId !== companyId) throw new ForbiddenException('You are not allowed to delete this job');

    await this.prisma.job.delete({ where: { id } });
    return { message: 'Job deleted successfully' };
  }
}
