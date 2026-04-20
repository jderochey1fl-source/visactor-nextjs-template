"use client";

import { useState } from "react";

import Container from "@/components/container";
import { FollowUpForm } from "@/components/email-generator/follow-up-form";
import { FollowUpOutput } from "@/components/email-generator/follow-up-output";
import { SequenceForm } from "@/components/email-generator/sequence-form";
import { SequenceOutput } from "@/components/email-generator/sequence-output";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { EmailSequence, SequenceInputs } from "@/data/email-sequence";
import type { FollowUpBundle, FollowUpInputs } from "@/data/follow-up";

export default function EmailGeneratorPage() {
  const [sequence, setSequence] = useState<EmailSequence | null>(null);
  const [isGeneratingSequence, setIsGeneratingSequence] = useState(false);
  const [sequenceError, setSequenceError] = useState<string | null>(null);

  const [followUp, setFollowUp] = useState<FollowUpBundle | null>(null);
  const [isGeneratingFollowUp, setIsGeneratingFollowUp] = useState(false);
  const [followUpError, setFollowUpError] = useState<string | null>(null);

  const handleGenerateSequence = async (inputs: SequenceInputs) => {
    setIsGeneratingSequence(true);
    setSequenceError(null);
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
      data.touches.sort((a, b) => a.number - b.number);
      setSequence(data);
    } catch (err) {
      setSequenceError(
        err instanceof Error
          ? err.message
          : "Something went wrong generating the sequence.",
      );
    } finally {
      setIsGeneratingSequence(false);
    }
  };

  const handleGenerateFollowUp = async (inputs: FollowUpInputs) => {
    setIsGeneratingFollowUp(true);
    setFollowUpError(null);
    try {
      const res = await fetch("/api/follow-up", {
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
      const data = (await res.json()) as FollowUpBundle;
      const order = { recap: 0, "value-add": 1, "re-engagement": 2 } as const;
      data.emails.sort((a, b) => order[a.type] - order[b.type]);
      setFollowUp(data);
    } catch (err) {
      setFollowUpError(
        err instanceof Error
          ? err.message
          : "Something went wrong generating the follow-up emails.",
      );
    } finally {
      setIsGeneratingFollowUp(false);
    }
  };

  return (
    <Container className="py-6">
      <Tabs defaultValue="sequence" className="flex flex-col gap-6">
        <TabsList className="w-full tablet:w-auto tablet:self-start">
          <TabsTrigger value="sequence" className="flex-1 tablet:flex-none">
            Cold Sequence
          </TabsTrigger>
          <TabsTrigger value="follow-up" className="flex-1 tablet:flex-none">
            Post-Meeting Follow-Up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sequence" className="mt-0">
          <div className="grid grid-cols-1 gap-6 laptop:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
            <div className="laptop:sticky laptop:top-6 laptop:self-start">
              <SequenceForm
                onGenerate={handleGenerateSequence}
                isGenerating={isGeneratingSequence}
              />
            </div>
            <SequenceOutput
              sequence={sequence}
              isGenerating={isGeneratingSequence}
              error={sequenceError}
              onChange={setSequence}
            />
          </div>
        </TabsContent>

        <TabsContent value="follow-up" className="mt-0">
          <div className="grid grid-cols-1 gap-6 laptop:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
            <div className="laptop:sticky laptop:top-6 laptop:self-start">
              <FollowUpForm
                onGenerate={handleGenerateFollowUp}
                isGenerating={isGeneratingFollowUp}
              />
            </div>
            <FollowUpOutput
              bundle={followUp}
              isGenerating={isGeneratingFollowUp}
              error={followUpError}
              onChange={setFollowUp}
            />
          </div>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
