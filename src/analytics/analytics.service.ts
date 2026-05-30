import { Injectable, Logger } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly analyticsRepo: AnalyticsRepository) {}

  async getSalarySummaryByCountry() {
    this.logger.log('Fetching salary summary by country');
    return this.analyticsRepo.getSalarySummaryByCountry();
  }

  async getAverageSalaryByJobTitle(country?: string) {
    this.logger.log(
      `Fetching average salary by job title${country ? ` for country: ${country}` : ''}`,
    );

    return this.analyticsRepo.getAverageSalaryByJobTitle(country);
  }

  async getHeadcountByCountryAndJobTitle() {
    this.logger.log('Fetching headcount by country and job title');
    return this.analyticsRepo.getHeadcountByCountryAndJobTitle();
  }

  async getSalaryOutliers() {
    this.logger.log('Fetching salary outliers');
    return this.analyticsRepo.getSalaryOutliers();
  }
}
