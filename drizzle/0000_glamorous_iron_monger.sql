CREATE TABLE "tasting_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"whiskey_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"author_name" text NOT NULL,
	"nose" text NOT NULL,
	"palate" text NOT NULL,
	"finish" text NOT NULL,
	"rating" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rating_range" CHECK ("tasting_notes"."rating" between 0 and 100)
);
--> statement-breakpoint
CREATE TABLE "whiskies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"distillery" text NOT NULL,
	"region" text NOT NULL,
	"age" integer,
	"abv" numeric(4, 1),
	"image_url" text,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tasting_notes" ADD CONSTRAINT "tasting_notes_whiskey_id_whiskies_id_fk" FOREIGN KEY ("whiskey_id") REFERENCES "public"."whiskies"("id") ON DELETE cascade ON UPDATE no action;