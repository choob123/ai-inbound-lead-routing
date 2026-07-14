"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";
import {
  ROUTING_RULES,
  assignRepresentative,
  categorizeInquiry,
  createRecordId,
  createTeamAlert,
  draftResponse,
  enrichCompany,
  estimatePotentialValue,
  getSlaState,
} from "./routing-model.mjs";

type InquiryForm = {
  name: string;
  email: string;
  company: string;
  domain: string;
  employees: string;
  message: string;
};

type FieldKey = keyof InquiryForm;

type WorkflowResult = {
  input: InquiryForm;
  generatedAt: string;
  enrichment: ReturnType<typeof enrichCompany>;
  category: ReturnType<typeof categorizeInquiry>;
  value: ReturnType<typeof estimatePotentialValue>;
  representative: ReturnType<typeof assignRepresentative>;
  recordId: string;
  record: Record<string, unknown>;
  responseDraft: string;
  teamAlert: string;
};

const scenarios: Array<{ id: string; label: string; detail: string; values: InquiryForm }> = [
  {
    id: "manufacturing",
    label: "Manufacturing",
    detail: "Technical automation route",
    values: {
      name: "Maya Chen",
      email: "maya@northstar.example",
      company: "Northstar Fabrication",
      domain: "northstar.example",
      employees: "420",
      message: "We want to automate repetitive service-request triage and connect the workflow to our ERP while keeping a human approval step.",
    },
  },
  {
    id: "healthcare",
    label: "Healthcare",
    detail: "Safeguards-first route",
    values: {
      name: "Jordan Lee",
      email: "jordan@fluxhealth.example",
      company: "Flux Health Services",
      domain: "fluxhealth.example",
      employees: "85",
      message: "We need an evaluation and safety audit for an AI assistant used in patient-support operations before a pilot expands.",
    },
  },
  {
    id: "enterprise",
    label: "Enterprise",
    detail: "Scale-based routing fallback",
    values: {
      name: "Alex Morgan",
      email: "alex@atlaslogistics.example",
      company: "Atlas Logistics Group",
      domain: "atlaslogistics.example",
      employees: "1200",
      message: "We need a discovery conversation about improving inbound commercial operations across our international teams.",
    },
  },
];

const workflowStages = [
  ["01", "Capture", "Validate synthetic inquiry"],
  ["02", "Enrich", "Match local company fixture"],
  ["03", "Classify", "Apply visible category rules"],
  ["04", "Estimate", "Calculate directional scope band"],
  ["05", "Route", "Use first matching owner rule"],
  ["06", "Prepare", "Build previews for human review"],
] as const;

function validate(form: InquiryForm) {
  const errors: Partial<Record<FieldKey, string>> = {};
  const domain = form.domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
  if (form.name.trim().length < 2) errors.name = "Enter a fictional contact name with at least two characters.";
  if (!/^[^\s@]+@[^\s@]+\.example$/i.test(form.email.trim())) errors.email = "Use a synthetic email ending in .example; do not enter personal data.";
  if (form.company.trim().length < 2) errors.company = "Enter a fictional company name.";
  if (!/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.example$/i.test(domain)) errors.domain = "Use a reserved .example domain, such as northstar.example.";
  const employees = Number(form.employees);
  if (!Number.isInteger(employees) || employees < 1 || employees > 1_000_000) errors.employees = "Enter a whole number from 1 to 1,000,000.";
  const messageLength = form.message.trim().length;
  if (messageLength < 20 || messageLength > 1_000) errors.message = "Enter 20 to 1,000 characters of synthetic inquiry context.";
  return errors;
}

function moneyBand(minimum: number, maximum: number) {
  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  return `${formatter.format(minimum)}–${formatter.format(maximum)}`;
}

function clock(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function InboundLeadRoutingDemo() {
  const [form, setForm] = useState<InquiryForm>(scenarios[0].values);
  const [activeScenario, setActiveScenario] = useState(scenarios[0].id);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [result, setResult] = useState<WorkflowResult | null>(null);
  const [dirty, setDirty] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [simulatedOffset, setSimulatedOffset] = useState(0);
  const [reviewed, setReviewed] = useState(false);
  const [interactionStatus, setInteractionStatus] = useState("");
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (startedAt === null || reviewed) return;
    const updateClock = () => setElapsed(Math.max(0, Math.floor((Date.now() - startedAt) / 1_000)));
    updateClock();
    const timer = window.setInterval(updateClock, 1_000);
    return () => window.clearInterval(timer);
  }, [reviewed, startedAt]);

  useEffect(() => {
    if (!result) return;
    window.requestAnimationFrame(() => resultRef.current?.focus());
  }, [result]);

  const displayedElapsed = elapsed + simulatedOffset;
  const sla = useMemo(() => getSlaState(displayedElapsed), [displayedElapsed]);

  function updateField(key: FieldKey, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setActiveScenario("");
    setDirty(Boolean(result));
  }

  function applyScenario(scenario: (typeof scenarios)[number]) {
    setForm({ ...scenario.values });
    setActiveScenario(scenario.id);
    setErrors({});
    setResult(null);
    setDirty(false);
    setStartedAt(null);
    setElapsed(0);
    setSimulatedOffset(0);
    setReviewed(false);
    setInteractionStatus(`${scenario.label} synthetic scenario loaded.`);
  }

  function runWorkflow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0] as FieldKey | undefined;
    if (firstInvalid) {
      setInteractionStatus("The synthetic inquiry needs attention before the workflow can run.");
      window.requestAnimationFrame(() => document.getElementById(`lead-${firstInvalid}`)?.focus());
      return;
    }

    const enrichment = enrichCompany(form.domain);
    const category = categorizeInquiry(form.message);
    const value = estimatePotentialValue(Number(form.employees), category.id);
    const representative = assignRepresentative({ employees: Number(form.employees), categoryId: category.id, enrichment });
    const recordId = createRecordId(form.company, category.id);
    const generatedAt = new Date().toISOString();
    const responseDraft = draftResponse({ name: form.name, company: form.company, category, representative });
    const teamAlert = createTeamAlert({ company: form.company, category, value, representative, recordId });
    const record: Record<string, unknown> = {
      id: recordId,
      generated_at: generatedAt,
      status: "DEMO_PREVIEW_REQUIRES_HUMAN_REVIEW",
      source: "Synthetic portfolio inquiry · browser only",
      contact: { name: form.name.trim(), email: form.email.trim() },
      company: { name: form.company.trim(), domain: enrichment.domain, stated_employees: Number(form.employees) },
      fixture_enrichment: {
        matched: enrichment.matched,
        industry: enrichment.industry,
        headquarters: enrichment.headquarters,
        employee_band: enrichment.employeeBand,
        confidence: enrichment.confidence,
        limitation: enrichment.explanation,
      },
      inquiry: { message: form.message.trim(), category: category.label, category_confidence: category.confidence, category_explanation: category.explanation },
      potential_value: {
        currency: "USD",
        minimum: value.minimum,
        maximum: value.maximum,
        confidence: value.confidence,
        limitation: "Directional scope only; not a quote, budget, probability, or revenue forecast.",
      },
      assignment: { owner: representative.representative, team: representative.team, rule: representative.label, reason: representative.reason },
      delivery: { crm: "preview_only", response: "draft_only", team_alert: "preview_only", external_transmissions: 0 },
    };

    setResult({ input: { ...form }, generatedAt, enrichment, category, value, representative, recordId, record, responseDraft, teamAlert });
    setDirty(false);
    setStartedAt(Date.now());
    setElapsed(0);
    setSimulatedOffset(0);
    setReviewed(false);
    setInteractionStatus("Synthetic workflow complete. No external system was contacted.");
  }

  async function copyText(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setInteractionStatus(`${label} copied. Nothing was sent.`);
    } catch {
      setInteractionStatus(`Copy was blocked by the browser. Select the ${label.toLowerCase()} manually.`);
    }
  }

  function downloadRecord() {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result.record, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${result.recordId.toLowerCase()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setInteractionStatus("Demo CRM record downloaded locally as JSON. No CRM was contacted.");
  }

  function markReviewed() {
    setReviewed(true);
    setStartedAt(null);
    setInteractionStatus("Synthetic inquiry marked reviewed in this browser only.");
  }

  return (
    <div className={styles.demoShell}>
      <div className={styles.demoBoundary} role="note">
        <span>Safe demo boundary</span>
        <p>Use only fictional details and reserved <strong>.example</strong> domains. Processing stays in this browser: no research API, AI API, CRM, email, or team-messaging service is contacted.</p>
      </div>

      <div className={styles.scenarioTabs} aria-label="Load a tested synthetic inquiry">
        {scenarios.map((scenario) => (
          <button type="button" className={activeScenario === scenario.id ? styles.selectedScenario : ""} aria-pressed={activeScenario === scenario.id} onClick={() => applyScenario(scenario)} key={scenario.id}>
            <strong>{scenario.label}</strong><span>{scenario.detail}</span>
          </button>
        ))}
      </div>

      <form className={styles.inquiryForm} onSubmit={runWorkflow} noValidate>
        <div className={styles.formHeading}>
          <div><span>01 / Synthetic inquiry</span><h3>Give the workflow context to route.</h3></div>
          <p>Every input is editable. The demo accepts only fictional .example contact data so a portfolio interaction cannot accidentally become a real lead submission.</p>
        </div>

        <div className={styles.formGrid}>
          <label htmlFor="lead-name">Fictional contact name
            <input id="lead-name" name="name" value={form.name} onChange={(event) => updateField("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "lead-name-error" : undefined} autoComplete="off" />
            {errors.name ? <small id="lead-name-error">{errors.name}</small> : null}
          </label>
          <label htmlFor="lead-email">Synthetic work email
            <input id="lead-email" name="email" type="email" inputMode="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby="lead-email-help" autoComplete="off" spellCheck={false} />
            <small id="lead-email-help">{errors.email ?? "Must end in .example; never enter a real email."}</small>
          </label>
          <label htmlFor="lead-company">Fictional company
            <input id="lead-company" name="company" value={form.company} onChange={(event) => updateField("company", event.target.value)} aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? "lead-company-error" : undefined} autoComplete="off" />
            {errors.company ? <small id="lead-company-error">{errors.company}</small> : null}
          </label>
          <label htmlFor="lead-domain">Synthetic company domain
            <input id="lead-domain" name="domain" value={form.domain} onChange={(event) => updateField("domain", event.target.value)} aria-invalid={Boolean(errors.domain)} aria-describedby="lead-domain-help" autoComplete="off" spellCheck={false} />
            <small id="lead-domain-help">{errors.domain ?? "Exact local fixtures: northstar.example, fluxhealth.example, atlaslogistics.example."}</small>
          </label>
          <label htmlFor="lead-employees">Stated number of employees
            <input id="lead-employees" name="employees" type="number" inputMode="numeric" min="1" max="1000000" step="1" value={form.employees} onChange={(event) => updateField("employees", event.target.value)} aria-invalid={Boolean(errors.employees)} aria-describedby={errors.employees ? "lead-employees-error" : "lead-employees-help"} />
            <small id={errors.employees ? "lead-employees-error" : "lead-employees-help"}>{errors.employees ?? "Used for the visible scope and routing rules; not independently verified."}</small>
          </label>
          <label className={styles.messageField} htmlFor="lead-message">What does the fictional company need?
            <textarea id="lead-message" name="message" rows={5} maxLength={1000} value={form.message} onChange={(event) => updateField("message", event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby="lead-message-help" />
            <span className={styles.messageMeta}><small id="lead-message-help">{errors.message ?? "Category rules look for visible keywords; ambiguous inquiries fall back to discovery."}</small><output aria-label="Inquiry character count">{form.message.length}/1,000</output></span>
          </label>
        </div>

        {dirty ? <p className={styles.staleNote} role="status">Inputs changed. The result below still reflects the last submitted synthetic scenario until you run the workflow again.</p> : null}
        <button className={styles.runButton} type="submit">Run synthetic workflow <span aria-hidden="true">→</span></button>
      </form>

      <ol className={styles.workflowTimeline} aria-label="Lead-routing workflow status">
        {workflowStages.map(([number, title, detail]) => (
          <li className={result ? styles.stageComplete : styles.stageWaiting} key={title}>
            <span>{number}</span><div><strong>{title}</strong><small>{detail}</small></div><i aria-hidden="true" />
          </li>
        ))}
      </ol>

      {!result ? (
        <div className={styles.emptyResult}><span>WORKFLOW / READY</span><h3>No record exists yet.</h3><p>Run a synthetic scenario to see the evidence, routing decision, draft-only outputs, and human-review timer.</p></div>
      ) : (
        <div className={styles.results} ref={resultRef} tabIndex={-1} aria-labelledby="lead-result-title">
          <header className={styles.resultHeader}>
            <div><span>02 / Explainable result · {result.recordId}</span><h3 id="lead-result-title">{result.category.label}</h3><p>Generated {new Date(result.generatedAt).toLocaleString()} · synthetic record awaiting human review</p></div>
            <strong>{result.category.confidence}</strong>
          </header>

          <div className={styles.evidenceGrid}>
            <article className={styles.enrichmentCard}>
              <header><span>Fixture enrichment</span><strong className={result.enrichment.matched ? styles.goodChip : styles.fallbackChip}>{result.enrichment.confidence}</strong></header>
              <h4>{result.enrichment.matched ? result.enrichment.company : result.input.company}</h4>
              <dl>
                <div><dt>Industry</dt><dd>{result.enrichment.industry}</dd></div>
                <div><dt>Headquarters</dt><dd>{result.enrichment.headquarters}</dd></div>
                <div><dt>Fixture size</dt><dd>{result.enrichment.employeeBand}</dd></div>
              </dl>
              {result.enrichment.signals.length ? <ul>{result.enrichment.signals.map((signal: string) => <li key={signal}>{signal}</li>)}</ul> : null}
              <p>{result.enrichment.explanation}</p>
            </article>

            <article className={styles.valueCard}>
              <header><span>Potential-value estimate</span><strong>Directional only</strong></header>
              <output>{moneyBand(result.value.minimum, result.value.maximum)}</output>
              <h4>Possible project-scope band</h4>
              <p>{result.value.explanation}</p>
              <small>It does not estimate budget, close probability, price, or expected revenue.</small>
            </article>
          </div>

          <section className={styles.routingPanel} aria-labelledby="routing-decision-title">
            <header><div><span>03 / Representative assignment</span><h3 id="routing-decision-title">First matching rule wins.</h3></div><p>Rules are ordered and visible. Missing enrichment never blocks the fallback route.</p></header>
            <ol>
              {ROUTING_RULES.map((rule, index) => (
                <li className={result.representative.id === rule.id ? styles.matchedRule : ""} key={rule.id}>
                  <span>0{index + 1}</span><div><strong>{rule.label}</strong><small>{rule.representative} · {rule.team}</small></div><b>{result.representative.id === rule.id ? "Matched" : "Not selected"}</b>
                </li>
              ))}
            </ol>
            <div className={styles.assignmentResult}><span>Assigned demo owner</span><h4>{result.representative.representative}</h4><strong>{result.representative.team}</strong><p>{result.representative.reason}</p></div>
          </section>

          <section className={styles.slaPanel} aria-labelledby="sla-title">
            <div>
              <span>04 / Human-review SLA simulator</span>
              <h3 id="sla-title">Response clock</h3>
              <p>This 60-second threshold is deliberately short for demonstration. A production SLA would be configured by channel, market, hours, and priority.</p>
            </div>
            <div className={`${styles.slaClock} ${styles[`sla_${reviewed ? "reviewed" : sla.id.replace("-", "_")}`]}`}>
              <output aria-label="Elapsed synthetic review time">{clock(displayedElapsed)}</output>
              <strong aria-live="polite">{reviewed ? "Human reviewed" : sla.label}</strong>
              <small>{reviewed ? "Marked reviewed locally; no CRM status was changed." : sla.detail}</small>
            </div>
            <div className={styles.slaActions}>
              <button type="button" onClick={() => setSimulatedOffset((current) => current + 30)} disabled={reviewed}>Simulate +30 sec</button>
              <button type="button" onClick={markReviewed} disabled={reviewed}>Mark reviewed · demo only</button>
            </div>
          </section>

          <div className={styles.outputGrid}>
            <article className={styles.outputCard}>
              <header><div><span>CRM record preview</span><strong>Local JSON only</strong></div><button type="button" onClick={downloadRecord}>Download demo JSON</button></header>
              <pre aria-label="Synthetic CRM record preview">{JSON.stringify(result.record, null, 2)}</pre>
              <p>No CRM API call is implemented. Download creates a file in this browser only.</p>
            </article>

            <article className={styles.outputCard}>
              <header><div><span>Personalized response</span><strong>Draft · not emailed</strong></div><button type="button" onClick={() => void copyText(result.responseDraft, "Response draft")}>Copy draft</button></header>
              <textarea readOnly value={result.responseDraft} rows={12} aria-label="Personalized response draft" />
              <p>A person must review, edit, and choose whether to send this template-derived draft.</p>
            </article>

            <article className={`${styles.outputCard} ${styles.alertCard}`}>
              <header><div><span>Team alert preview</span><strong>Preview · not posted</strong></div><button type="button" onClick={() => void copyText(result.teamAlert, "Team alert preview")}>Copy preview</button></header>
              <pre aria-label="Team alert preview">{result.teamAlert}</pre>
              <p>No Slack, Teams, webhook, or messaging integration is connected.</p>
            </article>
          </div>
        </div>
      )}

      <p className={styles.interactionStatus} role="status" aria-live="polite">{interactionStatus}</p>
    </div>
  );
}
