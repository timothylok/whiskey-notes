"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { tastingNotes, whiskies } from "@/db/schema";

export type ActionState = { error?: string } | undefined;

const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

const whiskeySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  distillery: z.string().trim().min(1, "Distillery is required").max(120),
  region: z.string().trim().min(1, "Region is required").max(80),
  age: z.coerce.number().int().min(0).max(100).optional(),
  abv: z.coerce.number().min(0).max(100).optional(),
  imageUrl: z
    .url()
    .refine((u) => new URL(u).hostname.endsWith(BLOB_HOST_SUFFIX), "Invalid image URL")
    .optional(),
});

const noteSchema = z.object({
  nose: z.string().trim().min(1, "Nose is required").max(2000),
  palate: z.string().trim().min(1, "Palate is required").max(2000),
  finish: z.string().trim().min(1, "Finish is required").max(2000),
  rating: z.coerce.number().int().min(0, "Rating must be 0–100").max(100, "Rating must be 0–100"),
});

// Empty form fields arrive as "" — treat them as absent so optional fields validate.
function formFields(formData: FormData) {
  return Object.fromEntries(
    [...formData.entries()].filter(([, v]) => typeof v === "string" && v.trim() !== ""),
  );
}

async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("You must be signed in");
  return userId;
}

export async function createWhiskey(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const userId = await requireUserId();
  const parsed = whiskeySchema.safeParse(formFields(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { abv, ...rest } = parsed.data;
  const [whiskey] = await db
    .insert(whiskies)
    .values({ ...rest, abv: abv?.toString(), createdBy: userId })
    .returning({ id: whiskies.id });

  revalidatePath("/");
  redirect(`/add?whiskey=${whiskey.id}`);
}

export async function deleteWhiskey(id: string) {
  const userId = await requireUserId();
  const [hasNote] = await db
    .select({ id: tastingNotes.id })
    .from(tastingNotes)
    .where(eq(tastingNotes.whiskeyId, id))
    .limit(1);
  if (hasNote) throw new Error("Cannot delete a whiskey that has tasting notes");

  await db.delete(whiskies).where(and(eq(whiskies.id, id), eq(whiskies.createdBy, userId)));
  revalidatePath("/");
  redirect("/");
}

export async function createNote(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const userId = await requireUserId();
  const whiskeyId = z.uuid().safeParse(formData.get("whiskeyId"));
  if (!whiskeyId.success) return { error: "Pick a whiskey" };
  const parsed = noteSchema.safeParse(formFields(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const user = await currentUser();
  const authorName = user?.fullName || user?.username || "Anonymous";

  const [note] = await db
    .insert(tastingNotes)
    .values({ ...parsed.data, whiskeyId: whiskeyId.data, userId, authorName })
    .returning({ id: tastingNotes.id });

  revalidatePath("/");
  revalidatePath(`/whiskey/${whiskeyId.data}`);
  redirect(`/tasting/${note.id}`);
}

export async function updateNote(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const userId = await requireUserId();
  const parsed = noteSchema.safeParse(formFields(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const [note] = await db
    .update(tastingNotes)
    .set(parsed.data)
    .where(and(eq(tastingNotes.id, id), eq(tastingNotes.userId, userId)))
    .returning({ whiskeyId: tastingNotes.whiskeyId });
  if (!note) return { error: "Note not found or not yours" };

  revalidatePath("/");
  revalidatePath(`/whiskey/${note.whiskeyId}`);
  revalidatePath(`/tasting/${id}`);
  redirect(`/tasting/${id}`);
}

export async function deleteNote(id: string) {
  const userId = await requireUserId();
  const [note] = await db
    .delete(tastingNotes)
    .where(and(eq(tastingNotes.id, id), eq(tastingNotes.userId, userId)))
    .returning({ whiskeyId: tastingNotes.whiskeyId });
  if (!note) throw new Error("Note not found or not yours");

  revalidatePath("/");
  revalidatePath(`/whiskey/${note.whiskeyId}`);
  redirect(`/whiskey/${note.whiskeyId}`);
}
