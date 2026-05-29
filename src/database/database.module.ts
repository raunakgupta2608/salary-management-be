import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'KNEX_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const connection: Knex.Config = {
          client: 'pg',
          connection: {
            host: configService.get<string>('DB_HOST'),
            port: Number(configService.get<string>('DB_PORT')),
            user: configService.get<string>('DB_USER'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
            ssl:
              configService.get('DB_SSL') === 'true'
                ? { rejectUnauthorized: false }
                : false,
          },
          migrations: {
            directory:
              process.env.NODE_ENV === 'production'
                ? './dist/database/migrations'
                : './src/database/migrations',
          },
          seeds: {
            directory:
              process.env.NODE_ENV === 'production'
                ? './dist/database/seeds'
                : './src/database/seeds',
          },
        };

        return knex(connection);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['KNEX_CONNECTION'],
})
export class DatabaseModule {}
