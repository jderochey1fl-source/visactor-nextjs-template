import type { Metadata } from "next";
import SideNav from "@/components/nav/side-nav";
import TopNav from "@/components/nav/top-nav";

export const metadata: Metadata = {
  title: "Agent — ASCEND",
  description:
    "Claude-powered sales coach trained on LADDER, ICP, and objection playbook.",
};

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <SideNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
