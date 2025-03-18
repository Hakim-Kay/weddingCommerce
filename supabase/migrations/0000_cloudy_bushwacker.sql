CREATE TYPE "public"."tag_enum" AS ENUM('Kasiki', 'Reception', 'Nikah', 'Studio', 'Magazine');--> statement-breakpoint
CREATE TABLE "image_downloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"downloaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_path" text NOT NULL,
	"thumbnail_path" text NOT NULL,
	"tags" "tag_enum"[] NOT NULL,
	"is_premium" boolean DEFAULT false NOT NULL,
	"download_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_premium_access" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"purchased_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_premium_access_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_favorites" (
	"user_id" text NOT NULL,
	"image_id" integer NOT NULL,
	CONSTRAINT "user_favorites_user_id_image_id_pk" PRIMARY KEY("user_id","image_id")
);
--> statement-breakpoint
ALTER TABLE "image_downloads" ADD CONSTRAINT "image_downloads_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;