import type { Knex } from 'knex';
import {
  createEmployeeTable,
  dropEmployeeTable,
} from '../../employee/migrations/create_employees_table';

export async function up(knex: Knex): Promise<void> {
  return createEmployeeTable(knex);
}

export async function down(knex: Knex): Promise<void> {
  return dropEmployeeTable(knex);
}
