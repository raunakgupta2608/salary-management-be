import { Knex } from 'knex';

/*
  used for performance improvisation.
  Below was the flow without this implementation
  Request -> Scan millions of employee rows -> GROUP BY -> AVG/MIN/MAX -> Return result.

  Updated flow
  Request -> Read 20-100 rows from summary table -> Return result
*/

export async function createCountrySalarySummaryTable(
  knex: Knex,
): Promise<void> {
  await knex.schema.createTable('country_salary_summary', (table) => {
    table.string('country', 255).primary();
    table.decimal('min_salary', 12, 2).notNullable();
    table.decimal('max_salary', 12, 2).notNullable();
    table.decimal('avg_salary', 12, 2).notNullable();
    table.integer('employee_count').notNullable();
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.raw(`
    CREATE INDEX idx_country_salary_summary_country
    ON country_salary_summary(country)
  `);
}

export async function dropCountrySalarySummaryTable(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('country_salary_summary');
}
