import type { Metadata } from "next";

import Container from "@/components/container";

export const metadata: Metadata = {
  title: "Email Generator | ASCEND — LADDER Sales OS",
  description:
    "Generate a full LADDER 6-touch outbound sequence with Claude. Signal-first openings, five-component emails, LinkedIn touches, and an honest break-up.",
};

export default function EmailGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <Container className="flex flex-col gap-1 border-b border-border py-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Email Generator
        </h1>
        <p className="text-sm text-muted-foreground">
          Four decisions in, a full 6-touch LADDER sequence out.
        </p>
      </Container>
      {children}
    </div>
  );
}
