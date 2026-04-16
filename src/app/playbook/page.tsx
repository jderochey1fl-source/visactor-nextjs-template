import Container from "@/components/container";
import { PlaybookBrowser } from "@/components/playbook/playbook-browser";

export default function PlaybookPage() {
  return (
    <Container className="py-6">
      <PlaybookBrowser />
    </Container>
  );
}
