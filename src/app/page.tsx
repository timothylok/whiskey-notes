import Link from "next/link";
import { Rating } from "@/components/rating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentNotes, getWhiskiesWithStats } from "@/db/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [notes, whiskies] = await Promise.all([getRecentNotes(), getWhiskiesWithStats()]);

  return (
    <div className="grid gap-10">
      <section className="grid gap-4">
        <h1 className="text-2xl font-semibold">Recent tastings</h1>
        {notes.length === 0 && (
          <p className="text-muted-foreground">
            No notes yet. <Link href="/add" className="underline">Add the first one</Link>.
          </p>
        )}
        {notes.map(({ note, whiskey }) => (
          <Link key={note.id} href={`/tasting/${note.id}`}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  {whiskey.name}
                  <Rating value={note.rating} />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p className="line-clamp-2">{note.palate}</p>
                <p className="mt-2 text-xs">
                  {note.authorName} · {note.createdAt.toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      {whiskies.length > 0 && (
        <section className="grid gap-3">
          <h2 className="text-xl font-semibold">Whiskies</h2>
          <ul className="divide-y rounded-lg border">
            {whiskies.map(({ whiskey, noteCount, avgRating }) => (
              <li key={whiskey.id}>
                <Link href={`/whiskey/${whiskey.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50">
                  <span>
                    {whiskey.name}{" "}
                    <span className="text-sm text-muted-foreground">
                      {whiskey.distillery} · {whiskey.region}
                    </span>
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {noteCount} {noteCount === 1 ? "note" : "notes"}
                    {avgRating && ` · avg ${Math.round(Number(avgRating))}`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
