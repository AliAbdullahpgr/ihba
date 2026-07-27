CREATE TABLE `gallery_items` (
	`id` text PRIMARY KEY NOT NULL,
	`state` text DEFAULT 'draft' NOT NULL,
	`image_url` text NOT NULL,
	`image_public_id` text,
	`layout` text DEFAULT 'landscape' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `gallery_state_order_idx` ON `gallery_items` (`state`,`sort_order`);--> statement-breakpoint
CREATE TABLE `gallery_translations` (
	`gallery_id` text NOT NULL,
	`locale` text NOT NULL,
	`category` text NOT NULL,
	`place` text NOT NULL,
	`caption` text NOT NULL,
	`image_alt` text NOT NULL,
	PRIMARY KEY(`gallery_id`, `locale`),
	FOREIGN KEY (`gallery_id`) REFERENCES `gallery_items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `gallery_translation_locale_idx` ON `gallery_translations` (`locale`);