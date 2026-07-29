# VULK Governance Console Demo Specification

Status: Public demonstration; not production software

## Purpose

Demonstrate one complete governable-intelligence workflow in a static browser application with no backend, live camera feed, paid service, or unsupported performance claims.

The demo exists to support founder-led discovery and a Governable Surveillance Design Sprint. It must show how policy and human authorization govern an event—not pretend that VULK already operates in the field.

## Scenario

A synthetic after-hours perimeter event occurs near a fictional water utility facility.

The demonstration must visibly identify all events, facilities, operators, and data as synthetic.

Workflow:

1. A synthetic edge sensor creates an event.
2. The system evaluates the configured deployment policy.
3. An operator reviews the evidence summary.
4. The operator may dismiss the event or request supervisor authorization.
5. A supervisor may deny or authorize a bounded action: notify the fictional site's on-duty security contact.
6. Every action appears in an append-only audit timeline.
7. The user can export a transparency record as JSON.

The software never represents notification as law-enforcement dispatch and never makes a consequential decision autonomously.

## Required surfaces

### 1. Mission and status header

Show:

- VULK Governance Console.
- DEMO / SYNTHETIC DATA label.
- Fictional deployment: North River Water Utility.
- Current workflow state.
- Reset scenario control.
- Link back to the VULK site.

### 2. Synthetic event queue

Include at least four events with varied dispositions:

- After-hours perimeter activity — requires review.
- Vehicle at service gate — policy-filtered/non-actionable.
- Wildlife motion — dismissed by operator.
- Maintenance access — authorized schedule match.

No real images, identities, license plates, addresses, or personal data.

### 3. Policy profile

Display a readable configuration including:

- Mission: protect a restricted utility perimeter after hours.
- Approved sources: perimeter camera event metadata and gate contact sensor.
- Prohibited processing: facial recognition and open-ended identity search.
- Default retention: 24 hours for non-actionable events.
- Escalated-record retention: 30 days for the controlled demo.
- Export role: supervisor only.
- Consequential action: human authorization required.

Controls may allow safe demo changes, but should not permit disabling the human-authorization requirement.

### 4. Event review

For the selected review event, show:

- Synthetic event ID.
- Timestamp marked as simulated.
- Edge-generated evidence summary.
- Which policy rules were applied.
- A visible statement that no identity was inferred.
- Operator actions:
  - Dismiss as non-actionable.
  - Request supervisor review.

### 5. Human authorization gate

After supervisor review is requested, show:

- Requested action: notify fictional on-duty site security.
- Evidence available.
- Policy basis.
- Retention consequence.
- Buttons to deny or authorize.
- Explicit copy: “VULK cannot execute this action without an accountable human.”

### 6. Append-only audit timeline

Log every meaningful action with:

- Sequence number.
- Simulated timestamp.
- Actor role.
- Action.
- Reason/policy reference.
- Result.

The timeline should be visibly append-only in the demo UI. It must include initial system events and subsequent user actions.

### 7. Transparency export

Export a JSON file containing:

- Demo disclaimer.
- Deployment name.
- Policy profile.
- Selected event.
- Final disposition.
- Complete audit records.
- Explicit list of prohibited processing.

Also provide a readable on-screen preview or confirmation of what the export contains.

## UX requirements

- Match the existing VULK black/cyan/amber design system without copying generic dashboard templates.
- This is an Operate/Inspect surface: compact, glanceable, and action-centered; no marketing hero.
- Responsive at 390px and 1280px.
- Keyboard-accessible controls and visible focus states.
- Semantic status labels; do not rely on color alone.
- Respect reduced-motion preferences.
- Do not use external JavaScript libraries.
- Avoid fake statistics, performance claims, maps, charts, or AI confidence scores.

## Technical constraints

- Static HTML/CSS/JavaScript only.
- Files should be `demo.html`, `demo.css`, and `demo.js` in the existing VULK landing repository.
- No network requests except existing web-font loading.
- No backend or authentication claim.
- State may be in-memory; localStorage is optional.
- Export must use a browser Blob and download link.
- Provide a reset control that reliably restores the initial state.
- Add a Demo navigation link from the homepage and design-partner brief.

## Acceptance tests

1. `demo.html` loads without console errors.
2. The page clearly says synthetic demo data.
3. The initial review event can be selected.
4. Requesting supervisor review appends an audit record and reveals the authorization gate.
5. Denying authorization appends an audit record and produces a denied final state.
6. Reset restores the initial state.
7. Authorizing the bounded notification appends an audit record and produces an authorized/logged final state.
8. Transparency JSON downloads and contains policy, event, disposition, and audit records.
9. Human authorization cannot be disabled.
10. No real identities, operational addresses, faces, license plates, or unsupported maturity claims appear.
11. Homepage and brief navigation reach the demo.
12. Desktop and mobile widths have no horizontal overflow.
