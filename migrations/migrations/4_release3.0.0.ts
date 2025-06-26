import type { Knex } from "knex";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex: Knex) {
  return knex.schema.createTable("anything", (table) => table.string("anything"))
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex: Knex) {
  return knex.schema.dropTable("anything")
};
