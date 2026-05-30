import { Module } from '@nestjs/common';
import knex from 'knex';
const knexConfig = require('../../knexfile');

export const KnexProvider = {
  provide: 'KNEX_CONNECTION',
  useFactory: async () => {
    return knex(knexConfig[process.env.ENV || 'development']);
  },
};

@Module({
  providers: [KnexProvider],
  exports: [KnexProvider],
})
export class DatabaseModule {}
