// Deterministic portfolio fixtures. No network, CRM, messaging, or model API is used here.

export const COMPANY_FIXTURES = Object.freeze({
  "northstar.example": Object.freeze({
    company: "Northstar Fabrication",
    industry: "Advanced manufacturing",
    headquarters: "Austin, United States",
    employeeBand: "201–500 employees",
    signals: Object.freeze(["Multi-site operations", "ERP modernization", "High-volume service workflows"]),
  }),
  "fluxhealth.example": Object.freeze({
    company: "Flux Health Services",
    industry: "Healthcare services",
    headquarters: "Boston, United States",
    employeeBand: "51–200 employees",
    signals: Object.freeze(["Regulated workflows", "Patient-support operations", "Human review required"]),
  }),
  "atlaslogistics.example": Object.freeze({
    company: "Atlas Logistics Group",
    industry: "Logistics",
    headquarters: "London, United Kingdom",
    employeeBand: "1,001–5,000 employees",
    signals: Object.freeze(["International operations", "High inquiry volume", "Distributed commercial team"]),
  }),
});

export const CATEGORY_RULES = Object.freeze([
  Object.freeze({ id: "evaluation", label: "AI evaluation & safeguards", keywords: Object.freeze(["audit", "evaluation", "safety", "risk", "compliance", "governance"]) }),
  Object.freeze({ id: "automation", label: "Workflow automation", keywords: Object.freeze(["automation", "automate", "repetitive", "integration", "workflow", "handoff"]) }),
  Object.freeze({ id: "product", label: "AI product build", keywords: Object.freeze(["prototype", "product", "build", "assistant", "copilot", "demo"]) }),
  Object.freeze({ id: "advisory", label: "AI strategy & advisory", keywords: Object.freeze(["strategy", "roadmap", "workshop", "advisory", "discovery"]) }),
]);

export const ROUTING_RULES = Object.freeze([
  Object.freeze({ id: "trust", label: "Safeguards or regulated context", representative: "Priya Shah", team: "Trust & Evaluation" }),
  Object.freeze({ id: "technical", label: "Automation or product-build inquiry", representative: "Theo Martin", team: "Solutions Engineering" }),
  Object.freeze({ id: "enterprise", label: "500+ stated employees", representative: "Amara Okafor", team: "Enterprise Partnerships" }),
  Object.freeze({ id: "fallback", label: "General discovery fallback", representative: "Maya Brooks", team: "Growth & Discovery" }),
]);

function normalizeDomain(domain) {
  return String(domain ?? "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

export function enrichCompany(domain) {
  const normalizedDomain = normalizeDomain(domain);
  const fixture = COMPANY_FIXTURES[normalizedDomain];
  if (!fixture) {
    return {
      matched: false,
      domain: normalizedDomain,
      company: "Unknown from fixture data",
      industry: "Unknown",
      headquarters: "Unknown",
      employeeBand: "Unknown",
      signals: [],
      confidence: "Fallback",
      explanation: "No synthetic research fixture matched this .example domain, so the system leaves company attributes unknown instead of guessing.",
    };
  }

  return {
    matched: true,
    domain: normalizedDomain,
    ...fixture,
    signals: [...fixture.signals],
    confidence: "Exact fixture match",
    explanation: "Matched by exact .example domain against the local synthetic fixture dataset; this is not live web research.",
  };
}

export function categorizeInquiry(message) {
  const normalized = String(message ?? "").toLowerCase();
  const tokens = new Set(normalized.match(/[a-z0-9]+/g) ?? []);
  for (const rule of CATEGORY_RULES) {
    const matchedKeywords = rule.keywords.filter((keyword) => {
      const keywordTokens = keyword.match(/[a-z0-9]+/g) ?? [];
      return keywordTokens.length === 1
        ? tokens.has(keywordTokens[0])
        : normalized.includes(keyword.toLowerCase());
    });
    if (matchedKeywords.length) {
      return {
        id: rule.id,
        label: rule.label,
        matchedKeywords,
        confidence: "Rule match",
        explanation: `Matched the visible ${rule.label.toLowerCase()} keyword rule: ${matchedKeywords.join(", ")}.`,
      };
    }
  }

  return {
    id: "general",
    label: "General discovery",
    matchedKeywords: [],
    confidence: "Fallback",
    explanation: "No category keyword matched, so the inquiry stays in general discovery for human review.",
  };
}

const CATEGORY_FACTORS = Object.freeze({ evaluation: 1.1, automation: 1.1, product: 1.15, advisory: 0.9, general: 0.75 });

export function estimatePotentialValue(employees, categoryId) {
  const statedEmployees = Number(employees);
  const sizeBand = statedEmployees <= 20
    ? { id: "micro", label: "1–20 employees", minimum: 4_000, maximum: 12_000 }
    : statedEmployees <= 100
      ? { id: "small", label: "21–100 employees", minimum: 12_000, maximum: 30_000 }
      : statedEmployees <= 500
        ? { id: "mid-market", label: "101–500 employees", minimum: 25_000, maximum: 65_000 }
        : { id: "enterprise", label: "501+ employees", minimum: 60_000, maximum: 140_000 };
  const factor = CATEGORY_FACTORS[categoryId] ?? CATEGORY_FACTORS.general;
  const roundToThousand = (value) => Math.max(1_000, Math.round(value / 1_000) * 1_000);

  return {
    minimum: roundToThousand(sizeBand.minimum * factor),
    maximum: roundToThousand(sizeBand.maximum * factor),
    sizeBand: sizeBand.label,
    sizeBandId: sizeBand.id,
    categoryFactor: factor,
    confidence: "Directional scope band",
    explanation: `The ${sizeBand.label} fixture band is multiplied by a ${factor.toFixed(2)} category factor. This estimates possible project scope—not budget, close probability, price, or expected revenue.`,
  };
}

export function assignRepresentative({ employees, categoryId, enrichment }) {
  const regulatedIndustry = enrichment.industry === "Healthcare services" || enrichment.industry === "Financial services";
  let rule = ROUTING_RULES[3];
  let reason = "No earlier rule matched; route to general discovery for a human qualification pass.";

  if (categoryId === "evaluation" || regulatedIndustry) {
    rule = ROUTING_RULES[0];
    reason = categoryId === "evaluation"
      ? "The safeguards/evaluation category matched the first routing rule."
      : "The matched synthetic company fixture has a regulated-industry context, which triggers the first routing rule.";
  } else if (categoryId === "automation" || categoryId === "product") {
    rule = ROUTING_RULES[1];
    reason = "The technical build category matched the second routing rule.";
  } else if (Number(employees) >= 500) {
    rule = ROUTING_RULES[2];
    reason = "The stated team size met the 500+ threshold in the third routing rule.";
  }

  return { ...rule, reason, ruleOrder: ROUTING_RULES.findIndex((item) => item.id === rule.id) + 1 };
}

export function createRecordId(company, categoryId) {
  const companyCode = String(company ?? "DEMO")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 18) || "DEMO";
  return `DEMO-${companyCode}-${String(categoryId).toUpperCase().slice(0, 4)}`;
}

export function draftResponse({ name, company, category, representative }) {
  const firstName = String(name ?? "there").trim().split(/\s+/)[0] || "there";
  const nextStep = {
    evaluation: "map the highest-risk use case and agree on an evaluation scorecard",
    automation: "walk through one repetitive workflow and quantify its current handoffs",
    product: "define the primary user, decision, and smallest testable product slice",
    advisory: "align on the business decision the roadmap needs to support",
    general: "clarify the highest-value problem and the evidence needed to scope it",
  }[category.id] ?? "clarify the problem and a useful next step";

  return `Hi ${firstName},\n\nThanks for the synthetic inquiry from ${company}. Based on the details provided, I would start by helping your team ${nextStep}.\n\nIf that direction is right, the next step would be a 25-minute discovery conversation. I would confirm the workflow, success measure, constraints, and who needs to review the outcome before proposing any work.\n\nBest,\n${representative.representative}\n${representative.team}`;
}

export function createTeamAlert({ company, category, value, representative, recordId }) {
  return [
    "[DEMO PREVIEW · NOT SENT] New synthetic inquiry",
    `Company: ${company}`,
    `Category: ${category.label} (${category.confidence})`,
    `Potential scope: $${value.minimum.toLocaleString("en-US")}–$${value.maximum.toLocaleString("en-US")} · directional only`,
    `Route: ${representative.representative} / ${representative.team}`,
    `Reason: ${representative.reason}`,
    `Record: ${recordId} · human review required`,
  ].join("\n");
}

export function getSlaState(elapsedSeconds) {
  const seconds = Math.max(0, Number(elapsedSeconds) || 0);
  if (seconds <= 30) return { id: "on-track", label: "On track", detail: "Human review has more than 30 seconds remaining in the 60-second demo SLA." };
  if (seconds <= 60) return { id: "attention", label: "Attention due", detail: "The demo SLA has 30 seconds or less remaining." };
  return { id: "exceeded", label: "SLA exceeded", detail: "The synthetic inquiry is still awaiting human review after the 60-second demo SLA." };
}
