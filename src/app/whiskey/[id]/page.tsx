import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteWhiskey } from "@/app/actions";
import { Rating } from "@/components/rating";
import { Button } from "@/components/ui/button";
import { getWhiskey } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/whiskey/[id]">) {
  const data = await getWhiskey((await params).id);
  return { title: data?.whiskey.name ?? "Whiskey not found" };
}

export default async function WhiskeyPage({ params }: PageProps<"/whiskey/[id]">) {
  const data = await getWhiskey((await params).id);
  if (!data) notFound();
  const { whiskey, notes } = data;
  const { userId } = await auth();
  const avg = notes.length ? Math.round(notes.reduce((s, n) => s + n.rating, 0) / notes.length) : null;

  return (
    <div className="grid gap-8">
      <section className="flex flex-col gap-6 sm:flex-row">
        {whiskey.imageUrl && (
          <Image
            src={whiskey.imageUrl}
            alt={whiskey.name}
            width={200}
            height={280}
            className="h-auto w-40 rounded-lg object-cover"
          />
        )}
        <div className="grid content-start gap-2">
          <h1 className="text-2xl font-semibold">{whiskey.name}</h1>
          <p className="text-muted-foreground">
            {whiskey.distillery} · {whiskey.region}
            {whiskey.age != null && ` · ${whiskey.age} years`}
            {whiskey.abv != null && ` · ${whiskey.abv}% ABV`}
          </p>
          {avg != null && (
            <p className="text-sm">
              Average <Rating value={avg} /> from {notes.length} {notes.length === 1 ? "tasting" : "tastings"}
            </p>
          )}
          <div className="mt-2 flex gap-2">
            <Link href={`/add?whiskey=${whiskey.id}`}>
              <Button>Add a tasting</Button>
            </Link>
            {userId === whiskey.createdBy && notes.length === 0 && (
              <form action={deleteWhiskey.bind(null, whiskey.id)}>
                <Button variant="destructive" type="submit">
                  Delete
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">Tastings</h2>
        {notes.length === 0 && <p className="text-muted-foreground">No tastings yet.</p>}
        {notes.length > 0 && (
          <ul className="divide-y rounded-lg border">
            {notes.map((note) => (
              <li key={note.id}>
                <Link
                  href={`/tasting/${note.id}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/50"
                >
                  <span className="line-clamp-1 text-sm">{note.palate}</span>
                  <span className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                    {note.authorName} <Rating value={note.rating} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
