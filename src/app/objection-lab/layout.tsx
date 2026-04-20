import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Objection Lab · ASCEND",
  description:
    "Log every objection, analyze with AI, pressure-test with role-play, and build a personal playbook.",
};

export default function ObjectionLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      aria-label="Objection Lab"
      className="flex w-full flex-1 flex-col bg-background"
    >
      {children}
    </section>
  );
}
