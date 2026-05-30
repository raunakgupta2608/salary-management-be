import { Knex } from 'knex';

// used to fill the data initially just once.
// can also be used as a rebuild function in case the summary table ever gets out of sync.
export async function backfillCountrySalarySummaryTable(
  knex: Knex,
): Promise<void> {
  await knex('country_job_title_salary_summary').truncate();

  await knex.raw(`
    INSERT INTO country_job_title_salary_summary (
      country,
      job_title,
      total_salary,
      employee_count,
      updated_at
    )
    SELECT
      country,
      job_title,
      SUM(salary),
      COUNT(*),
      NOW()
    FROM employees
    GROUP BY country, job_title
  `);
}

export async function truncateCountrySalarySummaryTable(
  knex: Knex,
): Promise<void> {
  await knex('country_job_title_salary_summary').truncate();
}
