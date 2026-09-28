import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteNote } from "@/app/actions";
import { Rating } from "@/components/rating";
import { ShareButtons } from "@/components/share-buttons";
import { Button } from "@/components/ui/button";
import { getNote } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/tasting/[id]">): Promise<Metadata> {
  const data = await getNote((await params).id);
  if (!data) return { title: "Tasting not found" };
  const title = `${data.whiskey.name} — ${data.note.rating}/100`;
  const description = `Nose: ${data.note.nose} Palate: ${data.note.palate} Finish: ${data.note.finish}`.slice(0, 200);
  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function TastingPage({ params }: PageProps<"/tasting/[id]">) {
  const data = await getNote((await params).id);
  if (!data) notFound();
  const { note, whiskey } = data;
  const { userId } = await auth();

  return (
    <article className="grid gap-6">
      <header className="flex flex-col gap-6 sm:flex-row">
        {whiskey.imageUrl && (
          <Image
            src={whiskey.imageUrl}
            alt={whiskey.name}
            width={200}
            height={280}
            className="h-auto w-40 rounded-lg object-cover"
          />
        )}
        <div className="grid content-start gap-1">
          <Link href={`/whiskey/${whiskey.id}`} className="text-sm text-muted-foreground hover:underline">
            {whiskey.distillery} · {whiskey.region}
          </Link>
          <h1 className="flex items-center gap-3 text-2xl font-semibold">
            {whiskey.name} <Rating value={note.rating} />
          </h1>
          <p className="text-sm text-muted-foreground">
            Tasted by {note.authorName} on {note.createdAt.toLocaleDateString()}
          </p>
        </div>
      </header>

      <dl className="grid gap-4">
        {(["nose", "palate", "finish"] as const).map((field) => (
          <div key={field}>
            <dt className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{field}</dt>
            <dd className="mt-1 whitespace-pre-line">{note[field]}</dd>
          </div>
        ))}
      </dl>

      <ShareButtons text={`My tasting notes for ${whiskey.name} — ${note.rating}/100`} />

      {userId === note.userId && (
        <div className="flex gap-2 border-t pt-4">
          <Link href={`/tasting/${note.id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <form action={deleteNote.bind(null, note.id)}>
            <Button variant="destructive" type="submit">
              Delete
            </Button>
          </form>
        </div>
      )}
    </article>
  );
}
