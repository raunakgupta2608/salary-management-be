import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class AppService {
  constructor(
    @Inject('KNEX_CONNECTION')
    private readonly knex: Knex,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getUsers() {
    return await this.knex('employees').select('*');
  }
}
