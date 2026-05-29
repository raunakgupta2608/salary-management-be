import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class EmployeeRepository {
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) {}

  // for easier unit testing
  protected buildBaseQuery() {
    return this.knex('employees').select('*').orderBy('id', 'asc');
  }

  async findAll(cursor?: number, limit = 20) {
    let query = this.buildBaseQuery().limit(limit + 1);

    if (cursor) {
      query = query.where('id', '>', cursor);
    }

    const employees = await query;

    const hasMore = employees.length > limit;
    if (hasMore) employees.pop();

    return {
      data: employees,
      nextCursor: hasMore ? employees[employees.length - 1].id : null,
      hasMore,
    };
  }
}
