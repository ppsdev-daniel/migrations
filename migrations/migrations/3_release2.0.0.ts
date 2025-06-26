import type { Knex } from "knex"

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable("roles", (table) => {
      table.increments("id").primary();
      table.string("name", 10);
    })
    .createTable("permissions", (table) => {
      table.increments("id").primary();
      table.string("can");
    })
    .createTable("roles_permissions", (table) => {
      table.increments("id").primary();
      table
        .integer("roleId")
        .unsigned()
        .references("id")
        .inTable("roles")
        .onDelete("CASCADE");
      table
        .integer("permissionId")
        .unsigned()
        .references("id")
        .inTable("permissions")
        .onDelete("CASCADE");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex: Knex) {
  return knex.schema.dropTable("roles_permissions").dropTable("roles").dropTable("permissions")
};
