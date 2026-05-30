import type { Knex } from 'knex';
import {
  backfillCountrySalarySummaryTable,
  truncateCountrySalarySummaryTable,
} from '../../analytics/migrations/backfill_country_job_title_salary';

export async function up(knex: Knex): Promise<void> {
  return backfillCountrySalarySummaryTable(knex);
}

export async function down(knex: Knex): Promise<void> {
  return truncateCountrySalarySummaryTable(knex);
}
