import type { Metadata } from "next";
import Link from "next/link";
import InboundLeadRoutingDemo from "./InboundLeadRoutingDemo";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "RoutePilot — AI Inbound Lead-Routing Workflow | Prasiddha K.",
  description: "An explainable, human-gated portfolio prototype for enriching, classifying, valuing, routing, and preparing responses to synthetic inbound inquiries.",
  alternates: { canonical: "https://prasiddhakarki.online/work/inbound-lead-routing" },
  openGraph: {
    title: "RoutePilot — AI Inbound Lead-Routing Workflow",
    description: "A polished interactive case study in transparent lead routing, deterministic fixture enrichment, human review, and safe integration boundaries.",
    type: "article",
    url: "https://prasiddhakarki.online/work/inbound-lead-routing",
    images: [{ url: "https://prasiddhakarki.online/og-live-products.png", width: 1200, height: 630, alt: "RoutePilot AI inbound lead-routing workflow case study" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoutePilot — AI Inbound Lead-Routing Workflow",
    description: "Synthetic enrichment, explainable value bands, ordered routing, preview-only outputs, and a visible human approval gate.",
    images: ["https://prasiddhakarki.online/og-live-products.png"],
  },
};

const architecture = [
  { number: "01", title: "Inquiry intake", copy: "Validate fictional contact, company, size, and problem context before any workflow logic runs.", boundary: "Browser form · .example data only" },
  { number: "02", title: "Fixture research", copy: "Match the normalized company domain against a small deterministic enrichment set, or preserve every attribute as unknown.", boundary: "Local fixtures · no live web research" },
  { number: "03", title: "Classify + estimate", copy: "Apply ordered keyword rules and a visible employee-band calculation to create an inquiry category and directional scope range.", boundary: "Inspectable rules · no probability score" },
  { number: "04", title: "Route", copy: "Evaluate safeguards, technical category, and scale rules in order; the first match assigns a demo representative.", boundary: "Deterministic first-match policy" },
  { number: "05", title: "Prepare previews", copy: "Assemble a CRM-shaped record, response draft, and team alert as local artifacts without transmitting them.", boundary: "Preview/download/copy only" },
  { number: "06", title: "Human review", copy: "Keep the inquiry in a visible review state with an SLA clock; a person remains responsible for every external action.", boundary: "No autonomous send or status update" },
];

const implementedTechnology = [
  ["Next.js + React", "Server-rendered case study with a focused client-side workflow."],
  ["TypeScript", "Typed form state, result contracts, and accessible interaction states."],
  ["Deterministic JavaScript model", "Fixture enrichment, category, value, routing, drafting, and SLA logic shared with tests."],
  ["CSS Modules", "Route-scoped responsive system with no dependency on a component library."],
  ["Browser Clipboard + Blob APIs", "Explicit local copy and JSON download actions; no hidden handoff."],
  ["Node test runner", "Executable fixtures validate decisions, fallbacks, thresholds, and safety language."],
];

const productionSeams = [
  ["Structured AI classification", "A production classifier could return a schema-validated category and abstain when evidence is weak."],
  ["Research provider", "Live enrichment would need licensed sources, provenance, freshness, consent, and an unknown-data fallback."],
  ["CRM adapter", "A least-privilege integration could create or update a record only after validation and idempotency checks."],
  ["Email + team messaging", "Draft and alert delivery would require explicit authorization, rate limits, audit logs, and human approval."],
];

const safeguards = [
  ["Synthetic input boundary", "The demo accepts reserved .example emails and domains, reducing the chance that portfolio visitors enter real contact data."],
  ["Unknown stays unknown", "Unmatched domains receive an explicit fallback instead of invented company research, industry, location, or size."],
  ["No probability theater", "Category confidence describes a rule match or fallback. Potential value is a scope band, never a close score or revenue forecast."],
  ["Visible routing policy", "Every owner rule and priority is shown, including the selected rule and the reason it won."],
  ["Preview-only actions", "CRM, response, and alert artifacts are clearly labeled local previews. Copy and download are the only available actions."],
  ["Human gate + SLA", "The timer measures waiting for review; marking reviewed changes browser state only and never updates an external system."],
];

export default function InboundLeadRoutingPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RoutePilot",
    applicationCategory: "BusinessApplication",
    description: "AI inbound lead-routing workflow portfolio prototype using synthetic data, transparent rules, and human review.",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    author: { "@type": "Person", name: "Prasiddha Karki", url: "https://prasiddhakarki.online" },
    url: "https://prasiddhakarki.online/work/inbound-lead-routing",
  };

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <a className={styles.skipLink} href="#routepilot-content">Skip to RoutePilot case study</a>

      <header className={styles.siteHeader}>
        <Link className={styles.brand} href="/" aria-label="Return to Prasiddha Karki portfolio">PK® <span>/ RoutePilot</span></Link>
        <nav aria-label="RoutePilot case study navigation">
          <a href="#interactive-demo">Interactive demo</a>
          <a href="#architecture">Architecture</a>
          <span className={styles.repoPending}>GitHub · publishing</span>
        </nav>
      </header>

      <main id="routepilot-content" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="routepilot-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><i aria-hidden="true" />Independent product case study · AI operations</p>
            <p className={styles.productName}>RoutePilot / AI inbound lead-routing workflow</p>
            <h1 id="routepilot-title">Turn every inquiry into an explainable next action.</h1>
            <p className={styles.heroSummary}>A human-gated workflow that researches a synthetic company, classifies the request, estimates potential scope, assigns the right representative, and prepares—not sends—the operational artifacts a team needs.</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="#interactive-demo">Run the synthetic workflow <span aria-hidden="true">↓</span></a>
              <span className={`${styles.secondaryAction} ${styles.repoPending}`}>Repository publishing pending</span>
            </div>
            <ul className={styles.heroProof} aria-label="RoutePilot product boundaries">
              <li><strong>0</strong><span>workflow-data transmissions</span></li>
              <li><strong>6</strong><span>visible workflow stages</span></li>
              <li><strong>1</strong><span>required human gate</span></li>
            </ul>
          </div>

          <div className={styles.heroSystem} aria-label="RoutePilot workflow illustration">
            <span className={styles.systemLabel}>ROUTEPILOT / TRACE 01</span>
            <div className={styles.systemCanvas} aria-hidden="true">
              <div className={styles.signalCard}><span>Inbound</span><b>01</b><small>Validated</small></div>
              <div className={styles.signalRail}><i /><i /><i /><i /></div>
              <div className={styles.routeCore}><span>Route</span><strong>Human</strong><small>approval gate</small></div>
              <div className={styles.outputRail}><i /><i /><i /></div>
              <div className={styles.outputLabels}><span>CRM preview</span><span>Draft</span><span>Alert</span></div>
            </div>
            <div className={styles.systemFooter}><span>Fixture evidence</span><span>Visible rules</span><span>No send</span></div>
          </div>
        </section>

        <dl className={styles.factStrip} aria-label="RoutePilot project facts">
          <div><dt>Primary user</dt><dd>Revenue-operations and growth teams</dd></div>
          <div><dt>Runtime</dt><dd>Browser-local deterministic prototype</dd></div>
          <div><dt>Core decision</dt><dd>Who should review this inquiry next?</dd></div>
          <div><dt>Safety boundary</dt><dd>Synthetic data · previews only</dd></div>
        </dl>

        <section className={`${styles.section} ${styles.demoSection}`} id="interactive-demo" aria-labelledby="interactive-title">
          <div className={styles.sectionHeading}>
            <div><p>01 / Working prototype</p><h2 id="interactive-title">The complete decision trail, in one interaction.</h2></div>
            <p>Start with a tested fixture or edit the synthetic inquiry. Every conclusion exposes the rule, input, limitation, and next human responsibility behind it.</p>
          </div>
          <InboundLeadRoutingDemo />
        </section>

        <section className={styles.section} id="architecture" aria-labelledby="architecture-title">
          <div className={styles.sectionHeading}>
            <div><p>02 / Architecture</p><h2 id="architecture-title">A production-shaped system with every adapter disconnected.</h2></div>
            <p>The prototype proves orchestration and interface behavior without pretending a local portfolio interaction is a deployed revenue system.</p>
          </div>
          <ol className={styles.architectureDiagram} aria-label="RoutePilot accessible system architecture">
            {architecture.map((step) => (
              <li key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.copy}</p><small>{step.boundary}</small></div></li>
            ))}
          </ol>
          <p className={styles.diagramCaption}>Reading order: inquiry intake → fixture research → classify and estimate → route → prepare previews → human review. Connectors represent the local decision flow, not workflow-data transmission.</p>
        </section>

        <section className={`${styles.section} ${styles.videoSection}`} aria-labelledby="video-title">
          <div className={styles.sectionHeading}>
            <div><p>03 / Walkthrough</p><h2 id="video-title">Watch the workflow make—and explain—a decision.</h2></div>
            <p>The adjacent outline repeats the demonstration stages so the content remains understandable without audio.</p>
          </div>
          <div className={styles.videoGrid}>
            <div className={styles.videoFrame}>
              <video controls preload="metadata" playsInline poster="https://prasiddhakarki.online/demos/inbound-lead-routing-poster.png" aria-label="RoutePilot product walkthrough" aria-describedby="video-description">
                <source src="https://prasiddhakarki.online/demos/inbound-lead-routing.mp4" type="video/mp4" />
                Your browser cannot play this MP4. Use the written walkthrough beside the video.
              </video>
              <span>Product walkthrough / user-controlled playback</span>
            </div>
            <div className={styles.videoOutline} id="video-description">
              <span>Written walkthrough</span>
              <ol>
                <li><strong>Load a safe fixture</strong><p>Select a manufacturing, healthcare, or enterprise .example scenario.</p></li>
                <li><strong>Run the decision flow</strong><p>See enrichment, category evidence, value-band math, and first-match routing.</p></li>
                <li><strong>Inspect every artifact</strong><p>Review the CRM JSON, response draft, alert preview, and their no-transmission labels.</p></li>
                <li><strong>Exercise the human gate</strong><p>Advance the SLA simulator and mark the inquiry reviewed locally.</p></li>
              </ol>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="technology-title">
          <div className={styles.sectionHeading}>
            <div><p>04 / Technology</p><h2 id="technology-title">Implemented now. Integration seams made explicit.</h2></div>
            <p>The distinction matters: a credible portfolio should separate working code from a proposed production adapter.</p>
          </div>
          <div className={styles.technologyColumns}>
            <section aria-labelledby="implemented-title"><h3 id="implemented-title">Implemented in this prototype</h3><ul>{implementedTechnology.map(([title, copy]) => <li key={title}><strong>{title}</strong><span>{copy}</span></li>)}</ul></section>
            <section aria-labelledby="seams-title"><h3 id="seams-title">Production integration seams · not connected</h3><ul>{productionSeams.map(([title, copy]) => <li key={title}><strong>{title}</strong><span>{copy}</span></li>)}</ul></section>
          </div>
        </section>

        <section className={`${styles.section} ${styles.outcomesSection}`} aria-labelledby="outcomes-title">
          <div className={styles.sectionHeading}>
            <div><p>05 / Evaluation</p><h2 id="outcomes-title">Fixture-tested outcomes, not vague confidence.</h2></div>
            <p>These checks execute against the same deterministic decision module used by the interactive prototype.</p>
          </div>
          <div className={styles.outcomeGrid}>
            <article><strong>3/3</strong><h3>Known domains enriched</h3><p>Every exact synthetic company fixture returns its expected industry and evidence state.</p></article>
            <article><strong>5/5</strong><h3>Category fixtures classified</h3><p>Evaluation, automation, product, advisory, and ambiguous fallback scenarios resolve predictably.</p></article>
            <article><strong>4/4</strong><h3>Routing rules exercised</h3><p>Trust, technical, enterprise, and general fallback representatives each win a tested scenario.</p></article>
            <article><strong>3/3</strong><h3>SLA states verified</h3><p>On-track, attention-due, and exceeded thresholds remain mutually exclusive and inspectable.</p></article>
            <article><strong>0</strong><h3>Lead-payload transmissions</h3><p>The component contains no fetch, form action, webhook, CRM, email, or team-messaging request.</p></article>
          </div>
        </section>

        <section className={`${styles.section} ${styles.safeguardSection}`} aria-labelledby="safeguards-title">
          <div className={styles.sectionHeading}>
            <div><p>06 / Safeguards</p><h2 id="safeguards-title">Automation stops where accountability begins.</h2></div>
            <p>The demo optimizes for a useful recommendation while preserving uncertainty, consent, reversibility, and a clear owner.</p>
          </div>
          <div className={styles.safeguardGrid}>{safeguards.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </section>

        <section className={styles.closing} aria-label="RoutePilot project actions">
          <div><p>Designed and engineered by Prasiddha Karki</p><h2>Route the evidence.<br />Keep the human.</h2></div>
          <div><a href="#interactive-demo">Run RoutePilot again <span aria-hidden="true">↑</span></a><span className={styles.repoPending}>GitHub publishing pending</span></div>
        </section>
      </main>

      <footer className={styles.footer}><span>© Prasiddha K. 2026</span><span>RoutePilot / AI inbound lead-routing workflow</span><Link href="/">Return to portfolio ↑</Link></footer>
    </div>
  );
}
