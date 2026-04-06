CREATE TABLE `flashcards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`materialId` int NOT NULL,
	`userId` int NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`difficulty` enum('easy','medium','hard') DEFAULT 'medium',
	`reviewCount` int DEFAULT 0,
	`lastReviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `flashcards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `past_paper_predictions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`subject` varchar(100) NOT NULL,
	`question` text NOT NULL,
	`topic` varchar(255) NOT NULL,
	`confidenceScore` decimal(3,2) NOT NULL,
	`wasCorrect` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `past_paper_predictions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`materialId` int NOT NULL,
	`userId` int NOT NULL,
	`question` text NOT NULL,
	`type` enum('mcq','longform') NOT NULL,
	`options` text,
	`correctAnswer` text NOT NULL,
	`explanation` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`subject` varchar(100) NOT NULL,
	`totalQuestions` int NOT NULL,
	`correctAnswers` int NOT NULL,
	`score` decimal(5,2) NOT NULL,
	`duration` int NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `revision_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`examDate` timestamp NOT NULL,
	`subject` varchar(100) NOT NULL,
	`totalTopics` int NOT NULL,
	`completedTopics` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `revision_plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `revision_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`planId` int NOT NULL,
	`userId` int NOT NULL,
	`topic` varchar(255) NOT NULL,
	`scheduledDate` timestamp NOT NULL,
	`duration` int NOT NULL,
	`priority` enum('high','medium','low') DEFAULT 'medium',
	`completed` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `revision_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `study_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`subject` varchar(100) NOT NULL,
	`content` text NOT NULL,
	`fileUrl` varchar(500),
	`summary` text,
	`keyPoints` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `study_materials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `study_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`subject` varchar(100) NOT NULL,
	`type` enum('quiz','revision','voice','summary') NOT NULL,
	`duration` int NOT NULL,
	`score` decimal(5,2),
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `study_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `voice_explanations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`topic` varchar(255) NOT NULL,
	`subject` varchar(100) NOT NULL,
	`audioUrl` varchar(500) NOT NULL,
	`transcript` text,
	`duration` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `voice_explanations_id` PRIMARY KEY(`id`)
);
