import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  COMPANY_FIXTURES,
  assignRepresentative,
  categorizeInquiry,
  createRecordId,
  createTeamAlert,
  draftResponse,
  enrichCompany,
  estimatePotentialValue,
  getSlaState,
} from "../app/work/inbound-lead-routing/routing-model.mjs";

test("enriches all three known synthetic company fixtures and preserves an honest fallback", () => {
  assert.equal(Object.keys(COMPANY_FIXTURES).length, 3);
  for (const [domain, fixture] of Object.entries(COMPANY_FIXTURES)) {
    const result = enrichCompany(`https://www.${domain}/about`);
    assert.equal(result.matched, true);
    assert.equal(result.domain, domain);
    assert.equal(result.company, fixture.company);
    assert.equal(result.industry, fixture.industry);
    assert.equal(result.confidence, "Exact fixture match");
    assert.match(result.explanation, /synthetic fixture dataset/i);
  }

  const fallback = enrichCompany("unknown.example");
  assert.equal(fallback.matched, false);
  assert.equal(fallback.industry, "Unknown");
  assert.equal(fallback.headquarters, "Unknown");
  assert.deepEqual(fallback.signals, []);
  assert.match(fallback.explanation, /instead of guessing/i);
});

test("classifies five inquiry fixtures with visible evidence or a general fallback", () => {
  const fixtures = [
    ["We need a compliance and safety evaluation.", "evaluation", "Rule match"],
    ["Please automate this repetitive workflow.", "automation", "Rule match"],
    ["We want to build a product prototype.", "product", "Rule match"],
    ["Help us create an AI strategy roadmap.", "advisory", "Rule match"],
    ["We would like to discuss a business problem.", "general", "Fallback"],
  ];

  for (const [message, expectedId, expectedConfidence] of fixtures) {
    const result = categorizeInquiry(message);
    assert.equal(result.id, expectedId);
    assert.equal(result.confidence, expectedConfidence);
    assert.ok(result.explanation.length > 20);
  }
});

test("matches whole keywords without accidental substring routes", () => {
  assert.equal(categorizeInquiry("Please demonstrate the current process.").id, "general");
  assert.equal(categorizeInquiry("We need a brisk conversation.").id, "general");
  assert.equal(categorizeInquiry("Please schedule a demo of the workflow.").id, "automation");
  assert.equal(categorizeInquiry("We need a risk review.").id, "evaluation");
});

test("exercises all four ordered representative routes", () => {
  const cases = [
    [{ employees: 85, categoryId: "general", enrichment: enrichCompany("fluxhealth.example") }, "trust", "Priya Shah"],
    [{ employees: 420, categoryId: "automation", enrichment: enrichCompany("northstar.example") }, "technical", "Theo Martin"],
    [{ employees: 1200, categoryId: "general", enrichment: enrichCompany("atlaslogistics.example") }, "enterprise", "Amara Okafor"],
    [{ employees: 12, categoryId: "general", enrichment: enrichCompany("unknown.example") }, "fallback", "Maya Brooks"],
  ];

  for (const [input, expectedRule, expectedOwner] of cases) {
    const result = assignRepresentative(input);
    assert.equal(result.id, expectedRule);
    assert.equal(result.representative, expectedOwner);
    assert.match(result.reason, /rule|route|context/i);
  }
});

test("keeps value ranges directional, monotonic by size, and separate from probability", () => {
  const values = [10, 50, 250, 2_000].map((employees) => estimatePotentialValue(employees, "automation"));
  for (const value of values) {
    assert.ok(value.minimum > 0);
    assert.ok(value.maximum > value.minimum);
    assert.match(value.confidence, /directional/i);
    assert.match(value.explanation, /not budget, close probability, price, or expected revenue/i);
  }
  assert.deepEqual(values.map((value) => value.sizeBandId), ["micro", "small", "mid-market", "enterprise"]);
  assert.ok(values.every((value, index) => index === 0 || value.minimum > values[index - 1].minimum));
});

test("builds deterministic preview artifacts without claiming delivery", () => {
  const category = categorizeInquiry("We want to automate a workflow.");
  const enrichment = enrichCompany("northstar.example");
  const representative = assignRepresentative({ employees: 420, categoryId: category.id, enrichment });
  const value = estimatePotentialValue(420, category.id);
  const recordId = createRecordId("Northstar Fabrication", category.id);
  const response = draftResponse({ name: "Maya Chen", company: "Northstar Fabrication", category, representative });
  const alert = createTeamAlert({ company: "Northstar Fabrication", category, value, representative, recordId });

  assert.equal(recordId, "DEMO-NORTHSTAR-FABRICAT-AUTO");
  assert.match(response, /^Hi Maya,/);
  assert.match(response, /25-minute discovery conversation/i);
  assert.match(response, /Theo Martin/);
  assert.match(alert, /^\[DEMO PREVIEW · NOT SENT\]/);
  assert.match(alert, /human review required/i);
});

test("returns three mutually exclusive demo SLA states", () => {
  assert.equal(getSlaState(0).id, "on-track");
  assert.equal(getSlaState(30).id, "on-track");
  assert.equal(getSlaState(31).id, "attention");
  assert.equal(getSlaState(60).id, "attention");
  assert.equal(getSlaState(61).id, "exceeded");
  assert.equal(getSlaState(-20).id, "on-track");
});

test("keeps the RoutePilot page accessible, preview-only, and locally implemented", async () => {
  const [page, component, model, styles] = await Promise.all([
    readFile(new URL("../app/work/inbound-lead-routing/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/work/inbound-lead-routing/InboundLeadRoutingDemo.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/work/inbound-lead-routing/routing-model.mjs", import.meta.url), "utf8"),
    readFile(new URL("../app/work/inbound-lead-routing/page.module.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /RoutePilot/);
  assert.match(page, /AI inbound lead-routing workflow/i);
  assert.match(page, /\/demos\/inbound-lead-routing\.mp4/);
  assert.match(page, /GitHub publishing pending/);
  assert.doesNotMatch(page, /codeRepository/);
  assert.match(page, /aria-label="RoutePilot accessible system architecture"/);
  assert.match(page, /Written walkthrough/);
  assert.match(page, /3\/3/);
  assert.match(page, /5\/5/);
  assert.match(page, /4\/4/);

  assert.match(component, /reserved <strong>\.example<\/strong> domains/);
  assert.match(component, /Run synthetic workflow/);
  assert.match(component, /Potential-value estimate/);
  assert.match(component, /First matching rule wins/);
  assert.match(component, /CRM record preview/);
  assert.match(component, /Personalized response/);
  assert.match(component, /Team alert preview/);
  assert.match(component, /Human-review SLA simulator/);
  assert.match(component, /new Blob/);
  assert.doesNotMatch(component, /\bfetch\s*\(/);
  assert.doesNotMatch(model, /\bfetch\s*\(/);
  assert.doesNotMatch(component, /<form[^>]+action=/i);
  assert.doesNotMatch(component, /mailto:|slack\.com\/api|hooks\.slack\.com/i);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /@media \(max-width: 680px\)/);
});
