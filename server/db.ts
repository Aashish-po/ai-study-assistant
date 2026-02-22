import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Study Materials
export async function createStudyMaterial(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(require("../drizzle/schema").studyMaterials).values(data);
  return (result as any)[0]?.insertId || 1;
}

export async function getUserStudyMaterials(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { studyMaterials } = require("../drizzle/schema");
  return db.select().from(studyMaterials).where(eq(studyMaterials.userId, userId));
}

export async function getStudyMaterial(id: number) {
  const db = await getDb();
  if (!db) return null;
  const { studyMaterials } = require("../drizzle/schema");
  const result = await db.select().from(studyMaterials).where(eq(studyMaterials.id, id));
  return result[0] || null;
}

// Quiz Sessions
export async function createQuizSession(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { quizSessions } = require("../drizzle/schema");
  const result = await db.insert(quizSessions).values(data);
  return (result as any)[0]?.insertId || 1;
}

export async function getUserQuizSessions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { quizSessions } = require("../drizzle/schema");
  return db.select().from(quizSessions).where(eq(quizSessions.userId, userId));
}

// Revision Plans
export async function createRevisionPlan(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { revisionPlans } = require("../drizzle/schema");
  const result = await db.insert(revisionPlans).values(data);
  return (result as any)[0]?.insertId || 1;
}

export async function getUserRevisionPlan(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const { revisionPlans } = require("../drizzle/schema");
  const result = await db.select().from(revisionPlans).where(eq(revisionPlans.userId, userId));
  return result[0] || null;
}

// Study Sessions
export async function createStudySession(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { studySessions } = require("../drizzle/schema");
  const result = await db.insert(studySessions).values(data);
  return (result as any)[0]?.insertId || 1;
}

export async function getUserStudySessions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { studySessions } = require("../drizzle/schema");
  return db.select().from(studySessions).where(eq(studySessions.userId, userId));
}

export async function updateStudyMaterial(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { studyMaterials } = require("../drizzle/schema");
  await db.update(studyMaterials).set(data).where(eq(studyMaterials.id, id));
}
