import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A/B Testing Lab — ASCEND",
  description:
    "Run structured A/B tests on cold-email variables with significance checks and AI-generated variants.",
};

export default function ABTestingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
