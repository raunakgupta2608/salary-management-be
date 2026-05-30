import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class AnalyticsRepository {
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) {}

  async getSalarySummaryByCountry() {
    return this.knex('country_salary_summary').select('*').orderBy('country');
  }

  async getAverageSalaryByJobTitle(country?: string) {
    return this.knex('country_job_title_salary_summary')
      .select('job_title')
      .select(
        this.knex.raw('total_salary / NULLIF(employee_count, 0) AS avg_salary'),
      )
      .select('employee_count')
      .modify((qb) => {
        if (country) qb.where('country', country);
      })
      .orderBy('job_title');
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

  async refreshCountrySalarySummary(): Promise<void> {
    await this.knex.transaction(async (trx) => {
      // 1. TRUNCATE table
      await trx('country_salary_summary').truncate();

      // 2. INSERT aggregated data
      await trx('country_salary_summary').insert(
        trx('employees')
          .select('country')
          .select(this.knex.raw('MIN(salary) as min_salary'))
          .select(this.knex.raw('MAX(salary) as max_salary'))
          .select(this.knex.raw('AVG(salary) as avg_salary'))
          .select(this.knex.raw('COUNT(*) as employee_count'))
          .select(this.knex.raw('NOW() as updated_at'))
          .groupBy('country'),
      );
    });
  }
}
