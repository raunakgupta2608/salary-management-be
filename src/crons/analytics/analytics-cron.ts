import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AnalyticsRepository } from '../../analytics/analytics.repository';

@Injectable()
export class CountrySalaryCronService {
  private readonly logger = new Logger(CountrySalaryCronService.name);

  constructor(private readonly analyticsRepo: AnalyticsRepository) {}

  @Cron(CronExpression.EVERY_10_HOURS)
  async refreshCountrySalarySummary() {
    this.logger.log('Starting country_salary_summary rebuild...');

    await this.analyticsRepo.refreshCountrySalarySummary();

    this.logger.log('country_salary_summary rebuild completed');
  }
}
