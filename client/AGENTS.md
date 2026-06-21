# LifeOS AI - AI Agent Instructions

## Project

LifeOS AI is a production-quality AI Operating System.

Always preserve the existing architecture.

Never rewrite working code.

Always improve incrementally.

---

## Current Progress

Completed

* Foundation
* Production Architecture
* App Shell
* Memory Module Foundation
* Knowledge Module Foundation
* Assistant Module Foundation

Next Module

* Tasks Module Foundation

---

## Tech Stack

Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion
* Zustand
* React Router

Future

* NestJS
* PostgreSQL
* Prisma
* Gemini AI

---

## Architecture Rules

* Follow the existing feature-first architecture.
* Every feature belongs in `src/modules/<feature>/`.
* Reuse existing components whenever possible.
* Do not duplicate code.
* Do not modify unrelated modules.
* Keep routing unchanged unless explicitly requested.

---

## Coding Rules

* Preserve the current design language.
* Use semantic HTML.
* Follow accessibility best practices.
* Keep components small and composable.
* Prefer TypeScript interfaces and strong typing.
* Avoid unnecessary dependencies.

---

## Verification

Before finishing any implementation:

Run:

npm run build

Run:

npm run lint

Fix every issue before completion.

---

## Git Rules

Never commit automatically.

Never push automatically.

Always wait for user approval.

---

## Response Format

Always provide:

1. Files created
2. Files modified
3. Architecture decisions
4. Future extensibility
5. Build status
6. Lint status

Wait for review before making commits.
