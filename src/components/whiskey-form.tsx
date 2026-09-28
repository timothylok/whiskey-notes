"use client";

import { upload } from "@vercel/blob/client";
import { useActionState } from "react";
import { createWhiskey, type ActionState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function WhiskeyForm() {
  const [state, formAction, pending] = useActionState(async (prev: ActionState, formData: FormData) => {
    const photo = formData.get("photo");
    formData.delete("photo");
    if (photo instanceof File && photo.size > 0) {
      try {
        const blob = await upload(`bottles/${photo.name}`, photo, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        formData.set("imageUrl", blob.url);
      } catch (e) {
        return { error: `Photo upload failed: ${(e as Error).message}` };
      }
    }
    return createWhiskey(prev, formData);
  }, undefined);

  return (
    <form action={formAction} className="grid gap-4">
      <Field label="Name" name="name" placeholder="Lagavulin 16" required />
      <Field label="Distillery" name="distillery" placeholder="Lagavulin" required />
      <Field label="Region" name="region" placeholder="Islay" required />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Age (years)" name="age" type="number" min={0} max={100} />
        <Field label="ABV %" name="abv" type="number" step="0.1" min={0} max={100} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="photo">Bottle photo (optional, max 5 MB)</Label>
        <Input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Add whiskey"}
      </Button>
    </form>
  );
}

function Field({ label, name, ...props }: { label: string; name: string } & React.ComponentProps<"input">) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </div>
  );
}
