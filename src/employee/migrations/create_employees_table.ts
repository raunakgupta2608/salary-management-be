import { Knex } from 'knex';

export async function createEmployeeTable(knex: Knex): Promise<void> {
  await knex.schema.createTable('employees', (table) => {
    table.increments('id').primary();

    table.string('full_name').notNullable();

    table.string('job_title').notNullable();

    table.string('country').notNullable();

    table.decimal('salary', 12, 2).notNullable();

    table.string('department');

    table.string('email').unique().notNullable();

    table.enu('employment_status', ['Active', 'Inactive']).defaultTo('Active');

    table.timestamps(true, true);
  });
}

export async function dropEmployeeTable(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('employees');
}
