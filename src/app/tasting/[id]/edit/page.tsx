import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { updateNote } from "@/app/actions";
import { NoteForm } from "@/components/note-form";
import { getNote } from "@/db/queries";

export const metadata = { title: "Edit tasting note" };

export default async function EditNotePage({ params }: PageProps<"/tasting/[id]/edit">) {
  const data = await getNote((await params).id);
  const { userId } = await auth();
  if (!data || data.note.userId !== userId) notFound();

  return (
    <div className="grid max-w-md gap-6">
      <h1 className="text-2xl font-semibold">Edit note — {data.whiskey.name}</h1>
      <NoteForm action={updateNote.bind(null, data.note.id)} defaults={data.note} submitLabel="Save changes" />
    </div>
  );
}
