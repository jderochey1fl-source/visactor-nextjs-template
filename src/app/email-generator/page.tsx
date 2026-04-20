"use client";

import { useState } from "react";

import Container from "@/components/container";
import { SequenceForm } from "@/components/email-generator/sequence-form";
import { SequenceOutput } from "@/components/email-generator/sequence-output";
import type { EmailSequence, SequenceInputs } from "@/data/email-sequence";

export default function EmailGeneratorPage() {
  const [sequence, setSequence] = useState<EmailSequence | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (inputs: SequenceInputs) => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/email-sequence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error ||
            `Generation failed (${res.status}). Make sure AI_GATEWAY_API_KEY is configured.`,
        );
      }
      const data = (await res.json()) as EmailSequence;
      // sort to guarantee order 1-6 regardless of model output ordering
      data.touches.sort((a, b) => a.number - b.number);
      setSequence(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong generating the sequence.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Container className="grid grid-cols-1 gap-6 py-6 laptop:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <div className="laptop:sticky laptop:top-6 laptop:self-start">
        <SequenceForm onGenerate={handleGenerate} isGenerating={isGenerating} />
      </div>
      <SequenceOutput
        sequence={sequence}
        isGenerating={isGenerating}
        error={error}
        onChange={setSequence}
      />
    </Container>
  );
}
