CREATE TABLE `site_media` (
	`key` text PRIMARY KEY NOT NULL,
	`image_url` text NOT NULL,
	`image_public_id` text NOT NULL,
	`updated_by` text,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
