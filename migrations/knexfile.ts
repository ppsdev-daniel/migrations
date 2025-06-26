// Update with your config settings.

import type { Knex } from "knex";
import dotenv from 'dotenv'
dotenv.config()

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config: { [key: string]: Knex.Config } =  {
  development: {
    client: "postgresql",
    connection: {
      database: process.env.DB_DATABASE || "test_db",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "brbr109br",
      host: process.env.DB_HOST || "localhost"
    },
    migrations: {
      directory: "./migrations",
      extension: "ts",
    }
  },
  staging: {
    client: "postgresql",
    connection: {
      database: process.env.DB_DATABASE|| "test_db",
      user: process.env.DB_USER|| "postgres",
      password: process.env.DB_PASSWORD|| "brbr109br",
      host: process.env.DB_HOST|| "localhost"
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./migrations",
      extension: "ts",
      tableName: "knex_migrations"
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: process.env.DB_DATABASE || "test_db",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "brbr109br",
      host: process.env.DB_HOST || "localhost"
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
      extension: "ts",
    },
  },
};

export default config