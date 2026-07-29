const policyProfile = {
  mission: "Protect a restricted utility perimeter after hours.",
  approvedSources: [
    "Perimeter camera event metadata",
    "Gate contact sensor"
  ],
  prohibitedProcessing: [
    "Facial recognition",
    "Open-ended identity search"
  ],
  defaultRetention: "24 hours for non-actionable events",
  escalatedRecordRetention: "30 days for the controlled demo",
  exportRole: "Supervisor only",
  consequentialAction: "Human authorization required"
};

const events = [
  {
    id: "SYN-NRWU-0001",
    title: "After-hours perimeter activity",
    timestamp: "Simulated 2026-02-18T21:42:00-05:00",
    source: "Perimeter camera metadata",
    disposition: "Requires review",
    statusClass: "status-review",
    summary: "Synthetic edge metadata reports motion near a restricted perimeter segment after the public access window has closed. No person, face, plate, or identity is present in the record.",
    evidence: "Motion region, after-hours timestamp, perimeter-zone tag, and gate contact state.",
    rulesApplied: [
      "Mission match: restricted utility perimeter after hours",
      "Approved source check: perimeter camera event metadata",
      "Prohibited processing check: no facial recognition or identity search",
      "Consequential action check: human authorization required"
    ],
    selectable: true
  },
  {
    id: "SYN-NRWU-0002",
    title: "Vehicle at service gate",
    timestamp: "Simulated 2026-02-18T19:08:00-05:00",
    source: "Gate contact sensor",
    disposition: "Policy-filtered / non-actionable",
    statusClass: "status-locked",
    summary: "Synthetic gate contact event occurred during the approved service window and does not require operator action.",
    evidence: "Gate contact open-close event and authorized service-window tag.",
    rulesApplied: [
      "Approved source check: gate contact sensor",
      "Schedule boundary check: within service window",
      "Retention rule: default non-actionable retention"
    ],
    selectable: false
  },
  {
    id: "SYN-NRWU-0003",
    title: "Wildlife motion",
    timestamp: "Simulated 2026-02-18T22:16:00-05:00",
    source: "Perimeter camera metadata",
    disposition: "Dismissed by operator",
    statusClass: "status-dismissed",
    summary: "Synthetic motion event was reviewed in the scenario seed and dismissed as non-actionable wildlife motion.",
    evidence: "Motion region outside restricted equipment zone and synthetic wildlife tag.",
    rulesApplied: [
      "Mission boundary check: outside restricted equipment zone",
      "Operator dismissal recorded",
      "Retention rule: default non-actionable retention"
    ],
    selectable: false
  },
  {
    id: "SYN-NRWU-0004",
    title: "Maintenance access",
    timestamp: "Simulated 2026-02-18T20:05:00-05:00",
    source: "Gate contact sensor",
    disposition: "Authorized schedule match",
    statusClass: "status-authorized",
    summary: "Synthetic access event matched a pre-approved maintenance schedule and did not require escalation.",
    evidence: "Gate contact event, maintenance window tag, and authorized schedule match.",
    rulesApplied: [
      "Approved source check: gate contact sensor",
      "Schedule match check: authorized maintenance window",
      "Retention rule: default non-actionable retention"
    ],
    selectable: false
  }
];

const initialAudit = [
  {
    actor: "System",
    action: "Synthetic event created",
    reason: "Edge sensor metadata generated SYN-NRWU-0001 for demo workflow",
    result: "Queued for operator review"
  },
  {
    actor: "Policy engine",
    action: "Deployment policy evaluated",
    reason: "Mission, approved sources, prohibited processing, retention, and human gate checked",
    result: "Supervisor authorization required before bounded notification"
  },
  {
    actor: "System",
    action: "Queue seeded with varied dispositions",
    reason: "Public demo requires review, filtered, dismissed, and schedule-matched examples",
    result: "Synthetic queue ready"
  }
];

const state = {
  selectedEventId: "SYN-NRWU-0001",
  workflowState: "Operator review required",
  finalDisposition: "Pending operator review",
  supervisorRequested: false,
  supervisorDecisionMade: false,
  decisionMade: false,
  audit: []
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  bindEvents();
  resetScenario();
});

function bindElements() {
  els.workflowState = document.querySelector("#workflow-state");
  els.eventList = document.querySelector("#event-list");
  els.reviewContent = document.querySelector("#review-content");
  els.selectedDisposition = document.querySelector("#selected-disposition");
  els.dismissEvent = document.querySelector("#dismiss-event");
  els.requestReview = document.querySelector("#request-review");
  els.authorizationGate = document.querySelector("#authorization-gate");
  els.gateEvidence = document.querySelector("#gate-evidence");
  els.gatePolicy = document.querySelector("#gate-policy");
  els.denyAction = document.querySelector("#deny-action");
  els.authorizeAction = document.querySelector("#authorize-action");
  els.auditTimeline = document.querySelector("#audit-timeline");
  els.resetScenario = document.querySelector("#reset-scenario");
  els.exportJson = document.querySelector("#export-json");
  els.exportStatus = document.querySelector("#export-status");
  els.downloadLink = document.querySelector("#download-link");
  els.exportPreview = document.querySelector("#export-preview");

  document.querySelector("#policy-mission").textContent = policyProfile.mission;
  renderList("#policy-sources", policyProfile.approvedSources);
  renderList("#policy-prohibited", policyProfile.prohibitedProcessing);
  document.querySelector("#policy-default-retention").textContent = policyProfile.defaultRetention;
  document.querySelector("#policy-escalated-retention").textContent = policyProfile.escalatedRecordRetention;
  document.querySelector("#policy-export-role").textContent = policyProfile.exportRole;
  document.querySelector("#policy-human-gate").textContent = policyProfile.consequentialAction;
}

function bindEvents() {
  els.resetScenario.addEventListener("click", resetScenario);
  els.dismissEvent.addEventListener("click", dismissSelectedEvent);
  els.requestReview.addEventListener("click", requestSupervisorReview);
  els.denyAction.addEventListener("click", denyAuthorization);
  els.authorizeAction.addEventListener("click", authorizeNotification);
  els.exportJson.addEventListener("click", exportTransparencyRecord);
}

function resetScenario() {
  state.selectedEventId = "SYN-NRWU-0001";
  state.workflowState = "Operator review required";
  state.finalDisposition = "Pending operator review";
  state.supervisorRequested = false;
  state.supervisorDecisionMade = false;
  state.decisionMade = false;
  getSelectedEvent().disposition = "Requires review";
  getSelectedEvent().statusClass = "status-review";
  state.audit = initialAudit.map((record, index) => makeAuditRecord(record, index + 1));
  if (els.downloadLink.href && els.downloadLink.href.startsWith("blob:")) {
    URL.revokeObjectURL(els.downloadLink.href);
  }
  els.downloadLink.hidden = true;
  els.downloadLink.removeAttribute("href");
  els.exportPreview.textContent = "No export generated yet.";
  render();
}

function render() {
  renderWorkflowState();
  renderEvents();
  renderReview();
  renderGate();
  renderAudit();
  renderExport();
}

function renderWorkflowState() {
  els.workflowState.textContent = state.workflowState;
  els.workflowState.className = "status-pill";
  if (state.finalDisposition.includes("Authorized")) {
    els.workflowState.classList.add("status-authorized");
  } else if (state.finalDisposition.includes("Denied")) {
    els.workflowState.classList.add("status-denied");
  } else if (state.finalDisposition.includes("Dismissed")) {
    els.workflowState.classList.add("status-dismissed");
  } else {
    els.workflowState.classList.add("status-review");
  }
}

function renderEvents() {
  els.eventList.replaceChildren(...events.map((event) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "event-card";
    button.setAttribute("aria-pressed", String(event.id === state.selectedEventId));
    button.disabled = !event.selectable;
    button.addEventListener("click", () => {
      state.selectedEventId = event.id;
      appendAudit({
        actor: "Operator",
        action: "Selected synthetic event",
        reason: `${event.id} opened for review`,
        result: "Evidence summary displayed"
      });
      render();
    });

    const title = document.createElement("h3");
    title.textContent = event.title;
    const meta = document.createElement("div");
    meta.className = "event-meta";
    meta.append(makeSpan(event.id), makeSpan(event.timestamp.replace("Simulated ", "Simulated ")));
    const status = document.createElement("span");
    status.className = `status-pill ${event.statusClass}`;
    status.textContent = event.disposition;
    const summary = document.createElement("p");
    summary.textContent = event.summary;

    button.append(title, meta, status, summary);
    item.append(button);
    return item;
  }));
}

function renderReview() {
  const event = getSelectedEvent();
  els.selectedDisposition.textContent = state.finalDisposition;
  els.selectedDisposition.className = "status-pill";
  if (state.finalDisposition.includes("Denied")) {
    els.selectedDisposition.classList.add("status-denied");
  } else if (state.finalDisposition.includes("Authorized")) {
    els.selectedDisposition.classList.add("status-authorized");
  } else if (state.finalDisposition.includes("Dismissed")) {
    els.selectedDisposition.classList.add("status-dismissed");
  } else {
    els.selectedDisposition.classList.add("status-review");
  }

  els.reviewContent.replaceChildren(
    reviewBlock("Synthetic event ID", event.id),
    reviewBlock("Timestamp", event.timestamp),
    reviewBlock("Evidence summary", event.summary, true),
    reviewListBlock("Policy rules applied", event.rulesApplied, true),
    identityStatement()
  );

  els.dismissEvent.disabled = state.decisionMade || state.supervisorRequested;
  els.requestReview.disabled = state.decisionMade || state.supervisorRequested;
}

function renderGate() {
  const event = getSelectedEvent();
  els.authorizationGate.hidden = !state.supervisorRequested;
  els.gateEvidence.textContent = event.evidence;
  els.gatePolicy.textContent = "The event matches the after-hours perimeter mission and uses approved metadata only. Consequential notification remains blocked until supervisor authorization.";
  els.denyAction.disabled = state.decisionMade;
  els.authorizeAction.disabled = state.decisionMade;
}

function renderAudit() {
  els.auditTimeline.replaceChildren(...state.audit.map((record) => {
    const item = document.createElement("li");
    item.className = "audit-record";
    const seq = document.createElement("div");
    seq.className = "audit-seq";
    seq.textContent = `#${String(record.sequence).padStart(2, "0")}`;
    const details = document.createElement("dl");
    details.append(
      auditPair("Simulated timestamp", record.timestamp),
      auditPair("Actor role", record.actor),
      auditPair("Action", record.action),
      auditPair("Reason / policy reference", record.reason),
      auditPair("Result", record.result)
    );
    item.append(seq, details);
    return item;
  }));
}

function renderExport() {
  els.exportJson.disabled = !state.supervisorDecisionMade;
  if (state.supervisorDecisionMade) {
    els.exportStatus.textContent = "Export available: supervisor final decision recorded.";
  } else if (state.supervisorRequested) {
    els.exportStatus.textContent = "Export unavailable: supervisor review was requested, but a final authorize or deny decision is required.";
  } else if (state.decisionMade) {
    els.exportStatus.textContent = "Export unavailable: operator dismissal is not supervisor authorization. A supervisor final decision is required.";
  } else {
    els.exportStatus.textContent = "Export unavailable: a supervisor must make a final authorize or deny decision.";
  }
}

function dismissSelectedEvent() {
  state.workflowState = "Dismissed by operator";
  state.finalDisposition = "Dismissed as non-actionable by operator";
  state.decisionMade = true;
  getSelectedEvent().disposition = "Dismissed by operator";
  getSelectedEvent().statusClass = "status-dismissed";
  appendAudit({
    actor: "Operator",
    action: "Dismissed synthetic event",
    reason: "Operator determined bounded notification was not warranted under demo policy",
    result: "No notification executed; default retention applies"
  });
  render();
}

function requestSupervisorReview() {
  state.workflowState = "Supervisor authorization requested";
  state.finalDisposition = "Pending supervisor decision";
  state.supervisorRequested = true;
  getSelectedEvent().disposition = "Supervisor review requested";
  getSelectedEvent().statusClass = "status-review";
  appendAudit({
    actor: "Operator",
    action: "Requested supervisor review",
    reason: "Policy requires accountable human authorization for consequential action",
    result: "Authorization gate revealed; action remains blocked"
  });
  render();
}

function denyAuthorization() {
  state.workflowState = "Authorization denied";
  state.finalDisposition = "Denied by supervisor; no notification executed";
  state.supervisorDecisionMade = true;
  state.decisionMade = true;
  getSelectedEvent().disposition = "Denied by supervisor";
  getSelectedEvent().statusClass = "status-denied";
  appendAudit({
    actor: "Supervisor",
    action: "Denied bounded notification",
    reason: "Supervisor did not authorize site-security notification",
    result: "Action denied and logged; escalated demo retention applies"
  });
  render();
}

function authorizeNotification() {
  state.workflowState = "Authorized and logged";
  state.finalDisposition = "Authorized by supervisor; fictional site security notification logged";
  state.supervisorDecisionMade = true;
  state.decisionMade = true;
  getSelectedEvent().disposition = "Authorized by supervisor";
  getSelectedEvent().statusClass = "status-authorized";
  appendAudit({
    actor: "Supervisor",
    action: "Authorized bounded notification",
    reason: "After-hours perimeter policy basis accepted by accountable human",
    result: "Fictional on-duty site security notification recorded; no law-enforcement dispatch represented"
  });
  render();
}

function exportTransparencyRecord() {
  if (!state.supervisorDecisionMade) {
    return;
  }
  appendAudit({
    actor: "Supervisor",
    action: "Generated transparency export",
    reason: "Export role is supervisor only",
    result: "JSON record prepared in browser Blob"
  });
  const record = buildTransparencyRecord();
  const json = JSON.stringify(record, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  if (els.downloadLink.href && els.downloadLink.href.startsWith("blob:")) {
    URL.revokeObjectURL(els.downloadLink.href);
  }
  els.downloadLink.href = URL.createObjectURL(blob);
  els.downloadLink.hidden = false;
  els.exportPreview.textContent = json;
  renderAudit();
}

function buildTransparencyRecord() {
  return {
    demoDisclaimer: "Public demonstration using synthetic data only. Not production software. No backend, live camera feed, real identity, license plate, address, law-enforcement dispatch, or autonomous consequential decision is represented.",
    deploymentName: "North River Water Utility",
    policyProfile,
    selectedEvent: getSelectedEvent(),
    finalDisposition: state.finalDisposition,
    auditRecords: state.audit,
    prohibitedProcessing: policyProfile.prohibitedProcessing
  };
}

function appendAudit(record) {
  state.audit.push(makeAuditRecord(record, state.audit.length + 1));
}

function makeAuditRecord(record, sequence) {
  return {
    sequence,
    timestamp: simulatedTimestamp(sequence),
    actor: record.actor,
    action: record.action,
    reason: record.reason,
    result: record.result
  };
}

function simulatedTimestamp(sequence) {
  const minute = 42 + sequence;
  const hour = 21 + Math.floor(minute / 60);
  const displayMinute = String(minute % 60).padStart(2, "0");
  return `Simulated 2026-02-18T${String(hour).padStart(2, "0")}:${displayMinute}:00-05:00`;
}

function getSelectedEvent() {
  return events.find((event) => event.id === state.selectedEventId);
}

function renderList(selector, items) {
  const list = document.querySelector(selector);
  list.replaceChildren(...items.map((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    return li;
  }));
}

function reviewBlock(title, text, wide = false) {
  const block = document.createElement("article");
  block.className = wide ? "review-block wide" : "review-block";
  const heading = document.createElement("h3");
  heading.textContent = title;
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  block.append(heading, paragraph);
  return block;
}

function reviewListBlock(title, items, wide = false) {
  const block = document.createElement("article");
  block.className = wide ? "review-block wide" : "review-block";
  const heading = document.createElement("h3");
  heading.textContent = title;
  const list = document.createElement("ul");
  list.append(...items.map((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    return li;
  }));
  block.append(heading, list);
  return block;
}

function identityStatement() {
  const block = document.createElement("article");
  block.className = "review-block wide identity-statement";
  const heading = document.createElement("h3");
  heading.textContent = "Identity boundary";
  const paragraph = document.createElement("p");
  paragraph.textContent = "No identity was inferred. This demo does not perform facial recognition, open-ended identity search, license plate recognition, or personal-data enrichment.";
  block.append(heading, paragraph);
  return block;
}

function auditPair(term, description) {
  const wrapper = document.createElement("div");
  const dt = document.createElement("dt");
  dt.textContent = term;
  const dd = document.createElement("dd");
  dd.textContent = description;
  wrapper.append(dt, dd);
  return wrapper;
}

function makeSpan(text) {
  const span = document.createElement("span");
  span.textContent = text;
  return span;
}
