import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { CompanyService } from './company/company.service';
import { EvolutionService } from './evolution/evolution.service';
import { EvolutionWebhookController } from './evolution/evolution.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [EvolutionWebhookController],
  providers: [PrismaService, CompanyService, EvolutionService],
  exports: [PrismaService, CompanyService, EvolutionService],
})
export class AppModule {}
