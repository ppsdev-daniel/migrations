import type { Knex } from "knex";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex: Knex) {
  return knex.schema
    .createTable("users", function (table) {
      table.increments("id");
      table.string("first_name", 255).notNullable();
      table.string("last_name", 255).notNullable();
    })
    .createTable("products", function (table) {
      table.increments("id");
      table.decimal("price").notNullable();
      table.string("name", 1000).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex: Knex) {
  return knex.schema.dropTable("products").dropTable("users");  
};
