CREATE TABLE `bank_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`currency` text NOT NULL,
	`bank_name` text DEFAULT '' NOT NULL,
	`account_holder` text DEFAULT '' NOT NULL,
	`iban` text DEFAULT '' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `bank_account_order_idx` ON `bank_accounts` (`sort_order`);--> statement-breakpoint
CREATE TABLE `org_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`whatsapp` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`maps_url` text DEFAULT '' NOT NULL,
	`working_hours` text DEFAULT '' NOT NULL,
	`registry_number` text DEFAULT '' NOT NULL,
	`tax_number` text DEFAULT '' NOT NULL,
	`mersis_number` text DEFAULT '' NOT NULL,
	`established_on` text DEFAULT '' NOT NULL,
	`org_status` text DEFAULT '' NOT NULL,
	`updated_by` text,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `project_images` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`image_url` text NOT NULL,
	`image_public_id` text,
	`caption_tr` text DEFAULT '' NOT NULL,
	`caption_en` text DEFAULT '' NOT NULL,
	`alt_tr` text DEFAULT '' NOT NULL,
	`alt_en` text DEFAULT '' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_image_order_idx` ON `project_images` (`project_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `social_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`platform` text NOT NULL,
	`label` text DEFAULT '' NOT NULL,
	`url` text DEFAULT '' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`open_in_new_tab` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `social_account_order_idx` ON `social_accounts` (`sort_order`);--> statement-breakpoint
ALTER TABLE `projects` ADD `lifecycle` text DEFAULT 'ongoing' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `featured` integer DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX `project_featured_idx` ON `projects` (`featured`,`sort_order`);--> statement-breakpoint
CREATE INDEX `audit_created_idx` ON `audit_logs` (`created_at`);