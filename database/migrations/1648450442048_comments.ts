import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Comments extends BaseSchema {
  protected tableName = "comments";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");

      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");

      table
        .integer("post_id")
        .unsigned()
        .references("id")
        .inTable("posts")
        .onDelete("CASCADE");
      table.text("content").notNullable();
      table
        .integer("parent_id")
        .references("id")
        .inTable("comments")
        .onDelete("CASCADE")
        .nullable();
      /*
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
