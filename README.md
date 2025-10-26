# AI Job Risk Calculator

A lightweight, browser-based quiz that helps you understand how AI adoption
might impact your job. Answer five quick questions and the tool highlights your
relative automation risk, the drivers behind it, and suggested next steps.

## Getting started

No build tools required—everything runs in the browser.

1. Start a simple static server (for example with Python):

   ```bash
   python -m http.server 8000
   ```

2. Open [http://localhost:8000](http://localhost:8000) in your browser and load
   `index.html`.

## How the score works

- **Industry baseline** – Each sector starts with a different exposure score
  based on current automation trends.
- **Task automation** – Highly repetitive work pushes your score upward.
- **AI adoption pace** – Early adopters create faster change; slow adopters buy
  you time.
- **Human touch** – Roles that rely on interpersonal skills reduce risk.
- **Experience** – Tenure and domain expertise dampen disruption when you keep
  learning.

The final percentage is bucketed into low, medium, or high exposure and is
paired with tailored insights and actions.

## Disclaimer

This calculator offers directional guidance, not guarantees. Combine it with
industry research and conversations inside your organization.
