# Skills & AI Inputs

Canonical record of agent skills, AI tooling, and external AI-assisted sources used while creating or maintaining this repo.

## Confirmed Agent Skills

### `frontend-design`

- Type: Cursor agent skill.
- Status: confirmed used.
- Used for: creating this Skills page and keeping the implementation aligned with the existing markdown-page pattern.
- Repo areas touched: `src/components/markdown-content-page.tsx`, `src/pages/skills.tsx`, `src/content/skills.md`, navigation wiring.
- Notes: loaded during the Skills page work on 2026-04-29.

### `caveman`

- Type: agent skill.
- Status: confirmed used.
- Used for: terse technical communication while making form-field and input refinements.
- Repo areas touched: Field/Input polish, spacing hierarchy, disabled/invalid states, label help affordances, changelog updates.
- Notes: transcript evidence shows manual skill attachment in Field/Input work sessions.

### `caveman-commit`

- Type: agent skill.
- Status: confirmed used.
- Used for: Conventional Commit message drafting.
- Repo areas touched: commit-message generation for research/style-reference work and related maintenance.
- Notes: transcript evidence shows manual skill attachment in commit-message sessions.

## AI Tooling And External Sources

### shadcn/ui docs, registry, and CLI

- Type: external docs, registry source, and CLI tooling.
- Status: confirmed used; not confirmed as an agent skill.
- Used for: component baselines and implementation parity.
- Repo areas touched: `Input`, `Field`, `Alert`, `Checkbox`, `RadioGroup`, `Label`, `Sonner`, `ButtonGroup`, `DropdownMenu`, `Badge`, `Spinner`, and trial-page demos.
- Notes: local setup uses shadcn with the `radix-mira` style preset.

### Figma MCP / design context

- Type: MCP design-reading tool.
- Status: confirmed read-only use.
- Used for: studying VuNet design basics, palette, typography, gradients, icons, and website-oriented design blocks.
- Repo areas touched: no direct code edits traced from that read-only study.
- Notes: useful as design input; not an agent skill.

### Web search / linked docs context

- Type: external context supplied through search results and links.
- Status: confirmed used.
- Used for: shadcn docs references and caveman skill/package context.
- Repo areas touched: component implementation decisions and commit-skill discovery discussion.

## Available But Not Confirmed Used Earlier

- `shadcn-ui` skill: installed/available in the agent environment, but no prior transcript evidence found before this page work.
- `make-interfaces-feel-better`: installed/available, no prior usage evidence found.
- `web-design-guidelines`: installed/available, no prior usage evidence found.
- `canvas`: installed/available, no prior usage evidence found.
- `caveman-review`: installed/available, no prior usage evidence found.
- `figma-use`: referenced by Figma MCP instructions, no prior usage evidence found.

## Maintenance Rule

- Add entries when a skill/tool materially influences code, design, docs, commits, PRs, or repo decisions.
- Mark each entry as `confirmed used`, `reference only`, or `available but not used`.
- Prefer repo areas and impact over raw transcript details.
