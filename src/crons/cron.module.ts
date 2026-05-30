import { Module } from '@nestjs/common';
import { CountrySalaryCronService } from './analytics/analytics-cron';
import { AnalyticsModule } from 'src/analytics/analytics.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), AnalyticsModule],
  providers: [CountrySalaryCronService],
})
export class CronModule {}
