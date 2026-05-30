import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class AnalyticsRepository {
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) {}

  async getSalarySummaryByCountry() {
    return this.knex('employees')
      .select('country')
      .min('salary as min_salary')
      .max('salary as max_salary')
      .avg('salary as avg_salary')
      .groupBy('country')
      .orderBy('country');
  }

  async getAverageSalaryByJobTitle(country?: string) {
    const query = this.knex('employees')
      .select('job_title')
      .avg('salary as avg_salary')
      .groupBy('job_title')
      .orderBy('job_title');

    if (country) {
      query.where('country', country);
    }

    return query;
  }

  async getHeadcountByCountryAndJobTitle() {
    return this.knex('employees')
      .select('country', 'job_title')
      .count('* as headcount')
      .groupBy('country', 'job_title')
      .orderBy('country')
      .orderBy('job_title');
  }

  async getSalaryOutliers() {
    return this.knex('employees')
      .select('*')
      .whereRaw(
        'salary > (select avg(salary) + 2 * stddev_pop(salary) from employees where country = employees.country)',
      )
      .orWhereRaw(
        'salary < (select avg(salary) - 2 * stddev_pop(salary) from employees where country = employees.country)',
      );
  }
}
