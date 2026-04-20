import { TopNav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { objections } from "@/data/objections";

export default function PlaybookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav
        title="Playbook"
        subtitle="Objection scripts · LADDER stage checklists · closing moves"
        action={
          <Badge variant="outline" className="font-mono text-xs">
            {objections.length} scripts
          </Badge>
        }
      />
      <main>{children}</main>
    </>
  );
}
