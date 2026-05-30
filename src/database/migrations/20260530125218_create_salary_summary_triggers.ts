import { Knex } from 'knex';
import {
  createCountrySalarySummaryTable,
  dropCountrySalarySummaryTable,
} from '../../analytics/migrations/country_salary_summary';

export async function up(knex: Knex): Promise<void> {
  return createCountrySalarySummaryTable(knex);
}

export async function down(knex: Knex): Promise<void> {
  return dropCountrySalarySummaryTable(knex);
}
