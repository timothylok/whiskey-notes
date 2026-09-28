"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { ActionState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type NoteDefaults = { nose: string; palate: string; finish: string; rating: number };

export function NoteForm({
  action,
  whiskies,
  whiskeyId,
  defaults,
  submitLabel,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  whiskies?: { id: string; name: string }[];
  whiskeyId?: string;
  defaults?: NoteDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="grid gap-4">
      {whiskies && (
        <div className="grid gap-2">
          <Label htmlFor="whiskeyId">Whiskey</Label>
          <select
            id="whiskeyId"
            name="whiskeyId"
            defaultValue={whiskeyId ?? ""}
            required
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            <option value="" disabled>
              Choose a whiskey…
            </option>
            {whiskies.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground">
            Not listed?{" "}
            <Link href="/whiskey/new" className="underline">
              Add a whiskey
            </Link>
          </p>
        </div>
      )}
      {(["nose", "palate", "finish"] as const).map((field) => (
        <div key={field} className="grid gap-2">
          <Label htmlFor={field} className="capitalize">
            {field}
          </Label>
          <Textarea id={field} name={field} defaultValue={defaults?.[field]} required rows={3} />
        </div>
      ))}
      <div className="grid gap-2">
        <Label htmlFor="rating">Rating (0–100)</Label>
        <Input
          id="rating"
          name="rating"
          type="number"
          min={0}
          max={100}
          defaultValue={defaults?.rating}
          required
          className="w-28"
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
