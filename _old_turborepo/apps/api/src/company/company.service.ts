import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async findBySlug(slug: string) {
    const company = await this.prisma.company.findUnique({
      where: { slug },
      include: {
        categories: {
          include: {
            products: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async findAll() {
    return this.prisma.company.findMany();
  }

  async create(data: any) {
    return this.prisma.company.create({ data });
  }
}
