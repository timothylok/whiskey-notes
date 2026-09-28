import { cache } from "react";
import { avg, count, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from ".";
import { tastingNotes, whiskies } from "./schema";

const isUuid = (id: string) => z.uuid().safeParse(id).success;

export const getNote = cache(async (id: string) => {
  if (!isUuid(id)) return null;
  const [row] = await db
    .select({ note: tastingNotes, whiskey: whiskies })
    .from(tastingNotes)
    .innerJoin(whiskies, eq(tastingNotes.whiskeyId, whiskies.id))
    .where(eq(tastingNotes.id, id));
  return row ?? null;
});

export const getWhiskey = cache(async (id: string) => {
  if (!isUuid(id)) return null;
  const [whiskey] = await db.select().from(whiskies).where(eq(whiskies.id, id));
  if (!whiskey) return null;
  const notes = await db
    .select()
    .from(tastingNotes)
    .where(eq(tastingNotes.whiskeyId, id))
    .orderBy(desc(tastingNotes.createdAt));
  return { whiskey, notes };
});

export function getRecentNotes(limit = 20) {
  return db
    .select({ note: tastingNotes, whiskey: whiskies })
    .from(tastingNotes)
    .innerJoin(whiskies, eq(tastingNotes.whiskeyId, whiskies.id))
    .orderBy(desc(tastingNotes.createdAt))
    .limit(limit);
}

export function getWhiskiesWithStats() {
  return db
    .select({ whiskey: whiskies, noteCount: count(tastingNotes.id), avgRating: avg(tastingNotes.rating) })
    .from(whiskies)
    .leftJoin(tastingNotes, eq(tastingNotes.whiskeyId, whiskies.id))
    .groupBy(whiskies.id)
    .orderBy(whiskies.name);
}

export function listWhiskies() {
  return db.select({ id: whiskies.id, name: whiskies.name }).from(whiskies).orderBy(whiskies.name);
}
