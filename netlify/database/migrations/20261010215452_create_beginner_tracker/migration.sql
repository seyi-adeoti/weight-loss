CREATE TABLE "food_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"profile_id" text NOT NULL,
	"date" date NOT NULL,
	"meal" text NOT NULL,
	"name" text NOT NULL,
	"grams" double precision,
	"calories" integer NOT NULL,
	"portion" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracker_profiles" (
	"id" text PRIMARY KEY,
	"target" integer,
	"goal_weight" double precision,
	"imported" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weight_entries" (
	"profile_id" text,
	"date" date,
	"weight" double precision NOT NULL,
	CONSTRAINT "weight_entries_pkey" PRIMARY KEY("profile_id","date")
);
--> statement-breakpoint
CREATE INDEX "food_profile_date_idx" ON "food_entries" ("profile_id","date");--> statement-breakpoint
ALTER TABLE "food_entries" ADD CONSTRAINT "food_entries_profile_id_tracker_profiles_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "tracker_profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "weight_entries" ADD CONSTRAINT "weight_entries_profile_id_tracker_profiles_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "tracker_profiles"("id") ON DELETE CASCADE;