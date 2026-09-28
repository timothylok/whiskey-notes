import { ImageResponse } from "next/og";
import { getNote } from "@/db/queries";

export const alt = "Whiskey tasting note";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const data = await getNote((await params).id);
  if (!data) return new Response("Not found", { status: 404 });
  const { note, whiskey } = data;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #2b1a0e 0%, #5c3413 100%)",
          color: "#fdf6ec",
          padding: 56,
          gap: 48,
        }}
      >
        {whiskey.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={whiskey.imageUrl}
            alt=""
            width={300}
            height={518}
            style={{ objectFit: "cover", borderRadius: 24 }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 26, color: "#e8b76a" }}>
            {whiskey.distillery} · {whiskey.region}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 8 }}>
            <div style={{ display: "flex", fontSize: 60, fontWeight: 700, lineHeight: 1.1 }}>
              {clip(whiskey.name, 40)}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 44,
                fontWeight: 700,
                background: "#e8b76a",
                color: "#2b1a0e",
                borderRadius: 16,
                padding: "6px 20px",
              }}
            >
              {note.rating}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 36, fontSize: 28 }}>
            {(["nose", "palate", "finish"] as const).map((field) => (
              <div key={field} style={{ display: "flex", gap: 16 }}>
                <span style={{ color: "#e8b76a", width: 110, textTransform: "uppercase", fontSize: 22, paddingTop: 4 }}>
                  {field}
                </span>
                <span style={{ flex: 1 }}>{clip(note[field], 90)}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", marginTop: "auto", fontSize: 24, color: "#d9c3a5" }}>
            Tasted by {note.authorName} · Whiskey Notes
          </div>
        </div>
      </div>
    ),
    size,
  );
}
