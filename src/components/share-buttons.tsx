"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const pageUrl = () => window.location.origin + window.location.pathname;

export function ShareButtons({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const popup = (href: string) => window.open(href, "_blank", "noopener,noreferrer");

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() => popup(`https://twitter.com/intent/tweet?${new URLSearchParams({ url: pageUrl(), text })}`)}
      >
        Share on X
      </Button>
      <Button
        variant="outline"
        onClick={() => popup(`https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: pageUrl() })}`)}
      >
        Share on Facebook
      </Button>
      <Button
        variant="outline"
        onClick={async () => {
          await navigator.clipboard.writeText(pageUrl());
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? "Copied!" : "Copy link"}
      </Button>
      <Button
        variant="outline"
        onClick={() => navigator.share?.({ title: text, url: pageUrl() }).catch(() => {})}
      >
        More…
      </Button>
    </div>
  );
}
