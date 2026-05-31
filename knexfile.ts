import { Knex } from 'knex';
import * as fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const useSSL = process.env.DB_SSL === 'true';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',

    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false,
      },
    },

    migrations: {
      directory: './src/database/migrations',
    },

    seeds: {
      directory: './src/database/seeds',
    },
  },

  production: {
    client: 'pg',

    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      ssl: useSSL
        ? {
            rejectUnauthorized: true,
            ca: process.env.DB_CA_CERT,
          }
        : true,
    },

    migrations: {
      directory: './dist/database/migrations',
    },

    seeds: {
      directory: './dist/database/seeds',
    },

    pool: {
      min: 2,
      max: 10,
    },
  },
};

module.exports = config;

// import * as fs from 'fs';
// import path from 'path';
// import { Knex } from 'knex';

// const useSSL = process.env.DB_SSL === 'true';
// console.log(path.join(process.cwd(), 'src/database/migrations'));

// const config: Knex.Config = {
// client: 'pg',

// connection: {
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,

//   ssl: useSSL
//     ? {
//         rejectUnauthorized: true,
//         ca: fs.readFileSync('certs/ca.pem').toString(),
//       }
//     : true,
// },

// migrations: {
//   directory: path.join(process.cwd(), 'src/database/migrations'),
//   extension: 'ts',
// },

// seeds: {
//   directory: path.resolve(__dirname, 'src/database/seeds'),
//   extension: 'ts',
// },

// pool: {
//   min: 2,
//   max: 10,
// },
// };

// export default config;
