// Pass-through layout. Each agent sub-route owns its own TopNav + main so
// chat-style routes can opt into full-height while card-grid routes scroll.
export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
