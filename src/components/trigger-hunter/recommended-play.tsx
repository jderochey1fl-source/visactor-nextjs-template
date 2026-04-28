"use client";

import { useState } from "react";
import { Check, Copy, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Account } from "@/data/trigger-hunter-mock";

export function RecommendedPlay({ account }: { account: Account }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!account.recommendedOpener || account.recommendedOpener === "—") return;
    await navigator.clipboard.writeText(account.recommendedOpener);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (
    account.recommendedOpener === "—" ||
    account.recommendedOpener.length === 0
  ) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2">
          <PhoneCall className="h-4 w-4" />
          Recommended play
        </CardTitle>
        <Badge variant="hot">15-min Fit Call</Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-xs font-medium text-muted-foreground">
          {account.recommendedPlay}
        </p>
        <blockquote className="rounded-md border-l-2 border-hot bg-hot/5 px-3 py-2 text-sm leading-relaxed">
          {account.recommendedOpener}
        </blockquote>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="h-8"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-3.5 w-3.5" />
                Copy opener
              </>
            )}
          </Button>
          <Button type="button" size="sm" className="h-8" disabled>
            Call now
          </Button>
          <Button type="button" size="sm" variant="outline" className="h-8" disabled>
            Mark contacted
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
