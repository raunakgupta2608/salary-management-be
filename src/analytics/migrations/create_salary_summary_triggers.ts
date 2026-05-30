import { Knex } from 'knex';

export async function createCountrySalarySummaryTable(
  knex: Knex,
): Promise<void> {
  // 1. Summary table
  await knex.schema.createTable('country_job_title_salary_summary', (table) => {
    table.string('country').notNullable();
    table.string('job_title').notNullable();

    table.decimal('total_salary', 18, 2).notNullable().defaultTo(0);
    table.integer('employee_count').notNullable().defaultTo(0);

    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    table.primary(['country', 'job_title']);
  });

  // 2. INSERT trigger function
  await knex.raw(`
    CREATE OR REPLACE FUNCTION fn_employee_insert()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO country_job_title_salary_summary (
        country,
        job_title,
        total_salary,
        employee_count,
        updated_at
      )
      VALUES (
        NEW.country,
        NEW.job_title,
        NEW.salary,
        1,
        NOW()
      )
      ON CONFLICT (country, job_title)
      DO UPDATE SET
        total_salary = country_job_title_salary_summary.total_salary + EXCLUDED.total_salary,
        employee_count = country_job_title_salary_summary.employee_count + 1,
        updated_at = NOW();

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // 3. DELETE trigger function
  await knex.raw(`
    CREATE OR REPLACE FUNCTION fn_employee_delete()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE country_job_title_salary_summary
      SET
        total_salary = total_salary - OLD.salary,
        employee_count = employee_count - 1,
        updated_at = NOW()
      WHERE country = OLD.country
        AND job_title = OLD.job_title;

      RETURN OLD;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // 4. UPDATE trigger function
  await knex.raw(`
    CREATE OR REPLACE FUNCTION fn_employee_update()
    RETURNS TRIGGER AS $$
    BEGIN
      -- remove old value
      UPDATE country_job_title_salary_summary
      SET
        total_salary = total_salary - OLD.salary,
        employee_count = employee_count - 1,
        updated_at = NOW()
      WHERE country = OLD.country
        AND job_title = OLD.job_title;

      -- add new value
      INSERT INTO country_job_title_salary_summary (
        country,
        job_title,
        total_salary,
        employee_count,
        updated_at
      )
      VALUES (
        NEW.country,
        NEW.job_title,
        NEW.salary,
        1,
        NOW()
      )
      ON CONFLICT (country, job_title)
      DO UPDATE SET
        total_salary = country_job_title_salary_summary.total_salary + EXCLUDED.total_salary,
        employee_count = country_job_title_salary_summary.employee_count + 1,
        updated_at = NOW();

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // 5. Attach triggers to employees
  await knex.raw(`
    CREATE TRIGGER trg_employee_insert
    AFTER INSERT ON employees
    FOR EACH ROW
    EXECUTE FUNCTION fn_employee_insert();
  `);

  await knex.raw(`
    CREATE TRIGGER trg_employee_delete
    AFTER DELETE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION fn_employee_delete();
  `);

  await knex.raw(`
    CREATE TRIGGER trg_employee_update
    AFTER UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION fn_employee_update();
  `);
}

export async function dropCountrySalarySummaryTable(knex: Knex): Promise<void> {
  // drop triggers
  await knex.raw(`DROP TRIGGER IF EXISTS trg_employee_insert ON employees;`);
  await knex.raw(`DROP TRIGGER IF EXISTS trg_employee_delete ON employees;`);
  await knex.raw(`DROP TRIGGER IF EXISTS trg_employee_update ON employees;`);

  // drop functions
  await knex.raw(`DROP FUNCTION IF EXISTS fn_employee_insert;`);
  await knex.raw(`DROP FUNCTION IF EXISTS fn_employee_delete;`);
  await knex.raw(`DROP FUNCTION IF EXISTS fn_employee_update;`);

  // drop table
  await knex.schema.dropTableIfExists('country_job_title_salary_summary');
}
