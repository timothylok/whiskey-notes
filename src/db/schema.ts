import { sql } from "drizzle-orm";
import { check, integer, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const whiskies = pgTable("whiskies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  distillery: text("distillery").notNull(),
  region: text("region").notNull(),
  age: integer("age"),
  abv: numeric("abv", { precision: 4, scale: 1 }),
  imageUrl: text("image_url"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const tastingNotes = pgTable(
  "tasting_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    whiskeyId: uuid("whiskey_id")
      .notNull()
      .references(() => whiskies.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    authorName: text("author_name").notNull(),
    nose: text("nose").notNull(),
    palate: text("palate").notNull(),
    finish: text("finish").notNull(),
    rating: integer("rating").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check("rating_range", sql`${t.rating} between 0 and 100`)],
);

export type Whiskey = typeof whiskies.$inferSelect;
export type TastingNote = typeof tastingNotes.$inferSelect;
