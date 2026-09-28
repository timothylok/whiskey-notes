import { createNote } from "@/app/actions";
import { NoteForm } from "@/components/note-form";
import { listWhiskies } from "@/db/queries";

export const metadata = { title: "Add a tasting note" };

export default async function AddNotePage({ searchParams }: PageProps<"/add">) {
  const { whiskey } = await searchParams;
  const whiskies = await listWhiskies();

  return (
    <div className="grid max-w-md gap-6">
      <h1 className="text-2xl font-semibold">Add a tasting note</h1>
      <NoteForm
        action={createNote}
        whiskies={whiskies}
        whiskeyId={typeof whiskey === "string" ? whiskey : undefined}
        submitLabel="Save note"
      />
    </div>
  );
}
