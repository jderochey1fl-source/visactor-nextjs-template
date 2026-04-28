import {
  Building2,
  CheckCircle2,
  DollarSign,
  Mail,
  MapPin,
  Quote,
  Target,
  TrendingUp,
  UserCheck,
  Video,
} from "lucide-react";

import Container from "@/components/container";

export const metadata = {
  title: "Product Knowledge — LADDER",
  description:
    "Single source of truth on what LADDER is, what it does, what it costs, and the math behind it.",
};

// All copy on this page is sourced from the LADDER Comprehensive Knowledge
// Base document. Numbers and benchmarks are stated exactly as published —
// do not round or invent additions without an authoritative source.

export default function ProductKnowledgePage() {
  return (
    <div>
      {/* HERO */}
      <Container className="border-b border-border py-10 md:py-14">
        <div className="relative overflow-hidden rounded-lg border border-hot/30 bg-gradient-to-br from-hot/[0.08] via-card to-card">
          <div
            aria-hidden
            className="absolute left-0 top-0 h-full w-1 bg-hot"
          />
          <div className="relative flex flex-col gap-5 px-6 py-10 md:px-10 md:py-12">
            <div className="flex items-center gap-2">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-hot" />
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-hot">
                Product Knowledge
              </p>
            </div>
            <h1 className="max-w-3xl text-balance text-3xl font-bold leading-[1.05] tracking-tight md:text-4xl lg:text-5xl">
              LADDER is the AI intelligence layer{" "}
              <span className="text-hot">built specifically for residential roofing.</span>
            </h1>
            <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              It eliminates the two biggest profit killers in the industry: a
              60% sales-rep turnover rate, and the canvassing waste of
              gut-feel territory deployment. Two products. One platform.
              Compounding revenue.
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-2">
                <DollarSign className="h-3 w-3 text-hot" />
                <span className="text-foreground">From $499/mo</span>
              </span>
              <span className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                Built for residential roofing
              </span>
              <span className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                25–200 employees · $5M–$50M revenue
              </span>
            </div>
          </div>
        </div>
      </Container>

      {/* SMARTHIRE */}
      <Container className="border-b border-border py-10">
        <div className="grid grid-cols-1 gap-8 laptop:grid-cols-3">
          <div className="laptop:col-span-1">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-hot" />
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-hot">
                Product 01
              </p>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              SmartHire
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              An AI video-screening and applicant-scoring system that runs on
              top of your existing Indeed / ZipRecruiter posts. Replaces ~40
              hours of resume triage with a four-stage intelligence funnel.
            </p>
          </div>

          <div className="laptop:col-span-2">
            {/* WORKFLOW */}
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                The four-stage workflow
              </p>
              <ol className="flex flex-col gap-4">
                {[
                  {
                    n: "1",
                    name: "Distribution",
                    body: "Plugs into Indeed, ZipRecruiter, and your existing job posts. No funnel replacement.",
                  },
                  {
                    n: "2",
                    name: "Capture",
                    body: "Within ~24 minutes of an applicant applying, an automated SMS asks for a 90-second video pitch + a personality screen. ~67% of applicants self-filter and never record.",
                  },
                  {
                    n: "3",
                    name: "Intelligence",
                    body: "AI analyzes the recorded video against 47 behavioral signals, benchmarked on a dataset of 1,000+ proven roofing closers. This is where the value lives — direct video analysis, not resume parsing.",
                  },
                  {
                    n: "4",
                    name: "Selection",
                    body: "Applicants land in the dashboard pre-scored. One-click Pass / Star / Hire. The 80+ Rule: any score ≥80 matches the proven-closer profile and is a green light to interview.",
                  },
                ].map((step) => (
                  <li key={step.n} className="flex gap-4">
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-md border border-hot/40 bg-hot/10 font-mono text-xs font-bold text-hot">
                      {step.n}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {step.name}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* BENCHMARKS */}
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { metric: "5x", label: "faster hiring" },
                { metric: "48%", label: "fewer washouts" },
                { metric: "94%", label: "accuracy vs traditional screening" },
                { metric: "2x", label: "better 90-day retention" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="rounded-md border border-border bg-card p-4"
                >
                  <p className="font-mono text-2xl font-bold text-hot">
                    {b.metric}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">
                    {b.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* SMARTTERRITORY */}
      <Container className="border-b border-border py-10">
        <div className="grid grid-cols-1 gap-8 laptop:grid-cols-3">
          <div className="laptop:col-span-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-hot" />
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-hot">
                Product 02
              </p>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              SmartTerritory
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Replaces gut-feel canvassing with daily plans built from the
              prospect&apos;s own win history, storm overlay, and demographic
              match. Daily territory planning compresses from 30 minutes to
              30 seconds.
            </p>
          </div>

          <div className="laptop:col-span-2">
            {/* FOUR UPGRADES */}
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Gut-feel → solved
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  {
                    from: "Guessing",
                    to: "Daily AI plan ready before crews leave",
                  },
                  {
                    from: "Researching",
                    to: "Storm and hail-event maps pre-loaded",
                  },
                  {
                    from: "Scouting",
                    to: "AI matches lookalike streets to past wins",
                  },
                  {
                    from: "Hoping",
                    to: "Predictive model sharpens weekly with each close",
                  },
                ].map((row) => (
                  <div
                    key={row.from}
                    className="flex flex-col gap-1.5 rounded-md border border-border bg-background p-3"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground line-through">
                      {row.from}
                    </p>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-hot" />
                      <p className="text-sm leading-snug text-foreground">
                        {row.to}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BENCHMARKS */}
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                { metric: "2.4x", label: "more appointments from same crew" },
                { metric: "67%", label: "projected close rate in high-affinity zones" },
                { metric: "2,300+", label: "door territories handled with precision" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="rounded-md border border-border bg-card p-4"
                >
                  <p className="font-mono text-2xl font-bold text-hot">
                    {b.metric}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">
                    {b.label}
                  </p>
                </div>
              ))}
            </div>

            {/* INTEGRATIONS */}
            <div className="mt-4 rounded-lg border border-border bg-card p-4">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Integrations
              </p>
              <p className="text-sm leading-relaxed text-foreground">
                Spotio · SalesRabbit · JobNimbus · Salesforce · HubSpot ·
                Excel/spreadsheet upload fallback for non-digital firms.
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* THE MATH */}
      <Container className="border-b border-border py-10">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-hot" />
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-hot">
            The Math
          </p>
        </div>
        <h2 className="mt-2 max-w-2xl text-balance text-2xl font-bold tracking-tight md:text-3xl">
          The platform pays for itself by preventing one bad hire.
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Cost of a bad sales hire
            </p>
            <p className="mt-2 font-mono text-3xl font-bold text-foreground">
              $11,000
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              industry average · $4,800 lower-end baseline
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Preventing a single washout pays for nearly two years of LADDER at
              the entry tier.
            </p>
          </div>
          <div className="rounded-lg border border-hot/30 bg-hot/5 p-6">
            <p className="font-mono text-[10px] uppercase tracking-wider text-hot">
              Platform pricing
            </p>
            <p className="mt-2 font-mono text-3xl font-bold text-foreground">
              From $499/mo
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Both products. One platform.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-foreground">
              ROI is immediate at the first prevented bad hire. Compounds
              every week from there.
            </p>
          </div>
        </div>

        {/* OPPORTUNITY GAP */}
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            The Opportunity Gap (typical)
          </p>
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Status quo waste</p>
              <p className="mt-1 font-mono text-xl font-bold text-foreground">
                ~$106,575/mo
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                hiring 5 reps + 3 canvassers monthly
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Typical LADDER savings</p>
              <p className="mt-1 font-mono text-xl font-bold text-foreground">
                $21K–$51K/mo
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                surfaced via the on-site calculators
              </p>
            </div>
            <div>
              <p className="text-xs text-hot">Revenue lift on optimization</p>
              <p className="mt-1 font-mono text-xl font-bold text-hot">
                ~$183K/mo
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                $429K/mo current → ~$612K/mo optimized
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* ICP + FOUNDER */}
      <Container className="border-b border-border py-10">
        <div className="grid grid-cols-1 gap-6 laptop:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-hot" />
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Ideal Customer Profile
              </p>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-foreground">
              Mid-size US residential roofing companies
            </h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <Building2 className="mt-0.5 h-4 w-4 flex-none text-hot" />
                <span>25–200 employees · $5M–$50M revenue</span>
              </li>
              <li className="flex gap-2">
                <UserCheck className="mt-0.5 h-4 w-4 flex-none text-hot" />
                <span>
                  Running a canvass motion (Spotio / SalesRabbit) plus a CRM
                  (JobNimbus / AccuLynx / Leap)
                </span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-hot" />
                <span>Storm restoration is a plus, not a requirement</span>
              </li>
              <li className="flex gap-2 text-xs">
                <span className="mt-0.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-muted-foreground/50" />
                <span>
                  LADDER sells <em>to</em> roofing companies — not to
                  homeowners.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <Quote className="h-4 w-4 text-hot" />
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Origin
              </p>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-foreground">
              Founder: Jason Avery
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Scaled national brands including ABC Pest Control with AI and
              tech, then went door-to-door in the Texas heat to learn roofing
              from the bottom rung.
            </p>
            <p className="mt-4 border-l-2 border-hot/60 pl-3 font-mono text-sm italic text-foreground">
              &ldquo;Built from a truck. Not a desk in San Francisco.&rdquo;
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-wider text-hot">
              Hire Right. Knock Right. Win More.
            </p>
          </div>
        </div>
      </Container>

      {/* CONTACT / NEXT STEP */}
      <Container className="py-8">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Where to go next
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            <a
              href="https://thisisladder.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-border bg-background p-4 transition hover:border-hot/50 hover:bg-hot/5"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-hot">
                Site
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                thisisladder.com
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Demo booking · ROI &amp; territory calculators · FAQ
              </p>
            </a>
            <a
              href="mailto:hr@thisisladder.com"
              className="rounded-md border border-border bg-background p-4 transition hover:border-hot/50 hover:bg-hot/5"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-hot">
                HR &amp; Roles
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                hr@thisisladder.com
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Talent and team inquiries
              </p>
            </a>
            <div className="rounded-md border border-border bg-background p-4">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-hot" />
                <p className="font-mono text-[10px] uppercase tracking-wider text-hot">
                  Inside ASCEND
                </p>
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">
                Coach agent uses these facts
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Every figure on this page is hard-wired into role-play, the
                debrief coach, and the email generator.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
