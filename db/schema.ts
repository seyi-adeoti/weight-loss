import {
  boolean,
  date,
  doublePrecision,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const trackerProfiles = pgTable("tracker_profiles", {
  id: text().primaryKey(),
  target: integer(),
  goalWeight: doublePrecision("goal_weight"),
  imported: boolean().notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const foodEntries = pgTable(
  "food_entries",
  {
    id: uuid().primaryKey().defaultRandom(),
    profileId: text("profile_id")
      .notNull()
      .references(() => trackerProfiles.id, { onDelete: "cascade" }),
    date: date().notNull(),
    meal: text().notNull(),
    name: text().notNull(),
    grams: doublePrecision(),
    calories: integer().notNull(),
    portion: text().notNull(),
  },
  (table) => [index("food_profile_date_idx").on(table.profileId, table.date)],
);

export const weightEntries = pgTable(
  "weight_entries",
  {
    profileId: text("profile_id")
      .notNull()
      .references(() => trackerProfiles.id, { onDelete: "cascade" }),
    date: date().notNull(),
    weight: doublePrecision().notNull(),
  },
  (table) => [primaryKey({ columns: [table.profileId, table.date] })],
);
