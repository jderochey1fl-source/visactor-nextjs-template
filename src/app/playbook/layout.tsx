import type { Metadata } from "next";
import SideNav from "@/components/nav/side-nav";
import TopNav from "@/components/nav/top-nav";

export const metadata: Metadata = {
  title: "Playbook — ASCEND",
  description: "Objection handling and LADDER stage scripts.",
};

export default function PlaybookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <SideNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
