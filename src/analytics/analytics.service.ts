import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsRepo: AnalyticsRepository) {}

  async getSalarySummaryByCountry() {
    return this.analyticsRepo.getSalarySummaryByCountry();
  }

  async getAverageSalaryByJobTitle(country?: string) {
    return this.analyticsRepo.getAverageSalaryByJobTitle(country);
  }

  async getHeadcountByCountryAndJobTitle() {
    return this.analyticsRepo.getHeadcountByCountryAndJobTitle();
  }

  async getSalaryOutliers() {
    return this.analyticsRepo.getSalaryOutliers();
  }
}
