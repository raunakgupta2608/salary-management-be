import { Knex } from 'knex';
import { faker } from '@faker-js/faker';

const departments = [
  'Engineering',
  'HR',
  'Finance',
  'Marketing',
  'Operations',
  'Sales',
  'Support',
];

type EmployeeSeed = {
  full_name: string;
  job_title: string;
  country: string;
  salary: number;
  department: string;
  email: string;
  employment_status: string;
  created_at: Date;
  updated_at: Date;
};

const statuses = ['Active', 'Inactive'];

export async function seed(knex: Knex): Promise<void> {
  // Delete existing entries
  await knex('employees').del();

  const employees: EmployeeSeed[] = [];

  for (let i = 0; i < 10000; i++) {
    employees.push({
      full_name: faker.person.fullName(),

      job_title: faker.person.jobTitle(),

      country: faker.location.country(),

      salary: faker.number.int({
        min: 30000,
        max: 250000,
      }),

      department: departments[Math.floor(Math.random() * departments.length)],

      email: faker.internet.email(),

      employment_status: statuses[Math.floor(Math.random() * statuses.length)],

      created_at: new Date(),

      updated_at: new Date(),
    });
  }

  // Insert in chunks for performance
  const chunkSize = 1000;

  for (let i = 0; i < employees.length; i += chunkSize) {
    const chunk = employees.slice(i, i + chunkSize);

    await knex('employees').insert(chunk);
  }

  console.log('Seeded 10,000 employees');
}
