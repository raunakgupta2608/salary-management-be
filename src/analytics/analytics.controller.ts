import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('country-salary-summary')
  getCountrySalarySummary() {
    return this.analyticsService.getSalarySummaryByCountry();
  }

  @Get('job-title-salary')
  getAverageSalaryByJobTitle(@Query('country') country?: string) {
    return this.analyticsService.getAverageSalaryByJobTitle(country);
  }

  @Get('headcount')
  getHeadcountByCountryAndJobTitle() {
    return this.analyticsService.getHeadcountByCountryAndJobTitle();
  }

  @Get('outliers')
  getSalaryOutliers() {
    return this.analyticsService.getSalaryOutliers();
  }
}
