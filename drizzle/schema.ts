import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// Study Materials/Notes
export const studyMaterials = mysqlTable("study_materials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  content: text("content").notNull(),
  fileUrl: varchar("fileUrl", { length: 500 }),
  summary: text("summary"),
  keyPoints: text("keyPoints"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Quiz Questions
export const quizQuestions = mysqlTable("quiz_questions", {
  id: int("id").autoincrement().primaryKey(),
  materialId: int("materialId").notNull(),
  userId: int("userId").notNull(),
  question: text("question").notNull(),
  type: mysqlEnum("type", ["mcq", "longform"]).notNull(),
  options: text("options"),
  correctAnswer: text("correctAnswer").notNull(),
  explanation: text("explanation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Quiz Sessions
export const quizSessions = mysqlTable("quiz_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  correctAnswers: int("correctAnswers").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }).notNull(),
  duration: int("duration").notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

// Past Paper Predictions
export const pastPaperPredictions = mysqlTable("past_paper_predictions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  question: text("question").notNull(),
  topic: varchar("topic", { length: 255 }).notNull(),
  confidenceScore: decimal("confidenceScore", { precision: 3, scale: 2 }).notNull(),
  wasCorrect: boolean("wasCorrect").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Revision Plans
export const revisionPlans = mysqlTable("revision_plans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  examDate: timestamp("examDate").notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  totalTopics: int("totalTopics").notNull(),
  completedTopics: int("completedTopics").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Revision Tasks
export const revisionTasks = mysqlTable("revision_tasks", {
  id: int("id").autoincrement().primaryKey(),
  planId: int("planId").notNull(),
  userId: int("userId").notNull(),
  topic: varchar("topic", { length: 255 }).notNull(),
  scheduledDate: timestamp("scheduledDate").notNull(),
  duration: int("duration").notNull(),
  priority: mysqlEnum("priority", ["high", "medium", "low"]).default("medium"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Voice Explanations
export const voiceExplanations = mysqlTable("voice_explanations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  topic: varchar("topic", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  audioUrl: varchar("audioUrl", { length: 500 }).notNull(),
  transcript: text("transcript"),
  duration: int("duration").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Flashcards
export const flashcards = mysqlTable("flashcards", {
  id: int("id").autoincrement().primaryKey(),
  materialId: int("materialId").notNull(),
  userId: int("userId").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("medium"),
  reviewCount: int("reviewCount").default(0),
  lastReviewedAt: timestamp("lastReviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Study Sessions
export const studySessions = mysqlTable("study_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  type: mysqlEnum("type", ["quiz", "revision", "voice", "summary"]).notNull(),
  duration: int("duration").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type StudyMaterial = typeof studyMaterials.$inferSelect;
export type InsertStudyMaterial = typeof studyMaterials.$inferInsert;

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;

export type QuizSession = typeof quizSessions.$inferSelect;
export type InsertQuizSession = typeof quizSessions.$inferInsert;

export type PastPaperPrediction = typeof pastPaperPredictions.$inferSelect;
export type InsertPastPaperPrediction = typeof pastPaperPredictions.$inferInsert;

export type RevisionPlan = typeof revisionPlans.$inferSelect;
export type InsertRevisionPlan = typeof revisionPlans.$inferInsert;

export type RevisionTask = typeof revisionTasks.$inferSelect;
export type InsertRevisionTask = typeof revisionTasks.$inferInsert;

export type VoiceExplanation = typeof voiceExplanations.$inferSelect;
export type InsertVoiceExplanation = typeof voiceExplanations.$inferInsert;

export type Flashcard = typeof flashcards.$inferSelect;
export type InsertFlashcard = typeof flashcards.$inferInsert;

export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = typeof studySessions.$inferInsert;
