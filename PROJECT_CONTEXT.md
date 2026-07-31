# NoPanic Projects — Project Context

Last reviewed: 31 July 2026  
Repository: [github.com/DistortionZA/school-app](https://github.com/DistortionZA/school-app)  
Branch: `main`  
Current commit: `2d81a9f` — `Initial NoPanic Projects pilot`

## 1. Executive summary

NoPanic Projects is a projects-first communication tool for South African primary schools. Its purpose is to prevent the familiar Sunday-night discovery that a learner has a project due the next day.

Teachers publish upcoming projects once. Families see them in a mobile-friendly web view and, once messaging is connected, receive WhatsApp alerts when projects are published and reminders as the due date approaches.

The current repository contains a polished, self-contained frontend pilot with seeded Grade 5 data. It is suitable for product demonstrations and workflow validation. It is not yet connected to a live database, authentication provider, WhatsApp account, or SA-SAMS installation.

The first real pilot is intentionally narrow: one Bloemfontein-area primary school for one term. The primary success question is whether project visibility reduces parent surprise while remaining quick enough for teachers to use consistently.

## 2. Product direction

### Target users

- Teachers who need to publish classroom projects quickly.
- Parents and guardians of Grade 1–7 learners who manage practical preparation at home.
- School administrators who need a low-support communication tool that can eventually understand SA-SAMS data.

### Core promise

> No more 9pm Sunday night project discoveries.

### Pilot success criteria

- At least 80% of invited families activate their access.
- At least 90% of eligible project notifications are accepted by the messaging provider.
- A teacher can publish a project in under two minutes.
- Parents can see the relevant project without installing a mobile app.
- Sync and messaging failures are visible, retryable, and do not lose data.
- No learner or family data crosses school, class, or guardian boundaries.

### Deliberate pilot scope

Included in the first live pilot:

- Teacher project creation and publication.
- Project title, subject, grade/class, due date, description, and materials.
- Parent project feed with days remaining.
- Parent “We’ve started” acknowledgement.
- WhatsApp publication and reminder messages.
- Read-only SA-SAMS learner/class/subject ingestion.
- POPIA baseline controls.

Deferred until the project workflow is validated:

- Marks capture and SA-SAMS-compatible CSV export.
- Fee statements and Ozow/PayShap payments.
- Attendance, timetables, report cards, and complex accounting.
- Direct writes to the SA-SAMS `.mdb` file.
- Project photo uploads unless the pilot demonstrates a clear need.

## 3. What has been completed

### Application

- Vite, React, and TypeScript project scaffold.
- Responsive teacher workspace for desktop/tablet use.
- Mobile-friendly parent preview.
- Teacher/parent view switcher for demonstrations.
- Seeded Grade 5 projects for Natural Sciences, Life Skills, and Mathematics.
- Project list with due dates, subjects, class, materials, and days remaining.
- Subject filtering.
- Teacher project creation modal with validation for title, description, subject, and due date.
- Local publish flow with confirmation toast.
- Parent “Mark as started” interaction.
- Responsive mobile navigation treatment.
- Empty/error/production integration states are not complete yet; current data is local and deterministic.

### Design and product context

- `PRODUCT.md` defines the audience, product register, principles, and anti-references.
- `DESIGN.md` defines the visual direction, OKLCH palette, typography, and component rules.
- The interface uses plum as the signature color, gold as a restrained accent, DM Sans for interface text, and Fraunces for selected headings.

### Data and integration foundations

- `supabase/schema.sql` defines the first relational model for schools, members, learners, guardian links, projects, acknowledgements, notification outbox records, and audit events.
- Row Level Security is enabled on the core tables, but production helper functions and policies still need to be completed and tested.
- `src/integrations/contracts.ts` defines provider-neutral interfaces for project APIs, school sync, and messaging.
- `.gitignore` excludes dependencies, build output, environment files, and local Supabase state.

### Repository

- Local Git metadata initialized on `main`.
- `origin` configured as `https://github.com/DistortionZA/school-app.git`.
- Initial application commit pushed successfully.
- Working tree was clean after the initial push.

## 4. Current architecture

```text
Teacher / Parent browser
        |
        v
TypeScript web application
        |
        +--> Supabase Auth and PostgreSQL
        |       +--> school membership and RLS
        |       +--> learners and guardian links
        |       +--> projects and acknowledgements
        |       +--> notification outbox and audit events
        |
        +--> Messaging provider adapter
        |       +--> WhatsApp templates
        |       +--> delivery callbacks
        |       +--> opt-in and opt-out records
        |
School Windows PC
        |
        +--> C#/.NET read-only sync agent
                +--> reads configured SA-SAMS .mdb data
                +--> normalizes source records
                +--> posts an authenticated sync batch
```

### Current boundary versus target state

| Area | Current state | Target state |
| --- | --- | --- |
| Browser data | Seeded local React state | Authenticated Supabase queries/mutations |
| Authentication | Not connected | Teacher/admin invites and verified parent phone onboarding |
| Database | SQL schema committed only | Applied migrations with tested RLS |
| SA-SAMS | Contract only | C#/.NET read-only agent using a real school mapping |
| WhatsApp | Contract only | Provider adapter, approved templates, outbox, callbacks |
| Audit/POPIA | Schema foundation | Consent, retention, deletion, export, and operational controls |
| Deployment | Local Vite build | Hosted web app with managed environments and monitoring |

## 5. Important data model decisions

The first schema uses these entities:

- `schools`: tenant boundary and school identity.
- `school_members`: user membership and role (`owner`, `admin`, `teacher`, `parent`).
- `learners`: school-owned learners with optional SA-SAMS source identifiers.
- `guardian_links`: explicit guardian-to-learner relationships and WhatsApp opt-in timestamp.
- `projects`: teacher-authored project details and publication status.
- `project_acknowledgements`: parent “started” state per project.
- `notification_outbox`: one record per recipient, project, and notification kind.
- `audit_events`: sensitive actions that need traceability.

Required invariants:

- Every school-owned query is tenant-scoped.
- Parents can access only explicitly linked learners.
- Teachers can access only their school and assigned teaching scope.
- Notification uniqueness prevents duplicate reminders during retries.
- SA-SAMS integration is read-only; the agent never writes into the `.mdb`.
- Sensitive data must not appear in application logs or error messages.

## 6. Work still required

### P0 — make the pilot real

1. Create a Supabase project and document environment variables.
2. Turn the committed SQL into migrations and add secure membership helper functions.
3. Complete and test RLS policies for every table.
4. Add authentication and school membership resolution.
5. Replace seeded project state with Supabase reads and writes.
6. Implement invitation, verified phone onboarding, guardian linking, and revocation.
7. Obtain a sanitized SA-SAMS backup from the pilot school.
8. Inspect actual tables and document the school-specific mapping.
9. Build the C#/.NET read-only Windows sync agent.
10. Implement sync reconciliation, deactivation, retries, logs, and last-sync status.
11. Select a WhatsApp provider and obtain approved templates.
12. Implement the notification outbox worker and delivery-status callbacks.
13. Implement consent, opt-out, audit, retention, export, and deletion workflows.

### P1 — pilot reliability

- Add loading, empty, validation, offline, and provider-failure UI states.
- Add unit, integration, authorization, and cross-tenant security tests.
- Test duplicate prevention for project publication and reminders.
- Test malformed `.mdb` files, missing columns, unavailable paths, and interrupted uploads.
- Add backup restoration and data-deletion runbooks.
- Add accessibility and responsive checks for teacher and parent surfaces.
- Add basic analytics for activation, delivery, project views, acknowledgements, and teacher posting time.
- Add deployment environments for local, staging, and production.

### P2 — post-pilot expansion

- Marks capture with validated SA-SAMS CSV export.
- Fee statements and payment links.
- Afrikaans and Sesotho localization.
- Optional project attachments or work-in-progress photos.
- Multi-school administration, custom branding, and pricing-tier enforcement.
- Engagement reports and operational dashboards.

## 7. Next development sequence

Work should proceed in this order:

1. Create the Supabase project and environment-variable strategy.
2. Complete migrations and RLS policy tests.
3. Add authenticated teacher and parent routes.
4. Move project listing, creation, publication, and acknowledgements to Supabase.
5. Implement invitations and guardian-learner linking.
6. Add the provider-neutral WhatsApp adapter and outbox scheduler.
7. Prepare and validate message templates with the chosen provider.
8. Obtain and inspect the pilot school’s sanitized SA-SAMS backup.
9. Implement the first school-specific sync mapping and reconciliation behavior.
10. Build and package the Windows agent with manual sync and scheduled sync.
11. Run an internal synthetic-data pilot.
12. Install at one friendly school and monitor the first term weekly.
13. Fix pilot blockers before starting marks, fees, or broader school onboarding.

## 8. Public interfaces and contracts

The current integration boundary is defined in `src/integrations/contracts.ts`.

### `SchoolSyncClient`

- `sync(batch: SyncBatch): Promise<SyncStatus>` accepts normalized learner and subject data.
- `getStatus(): Promise<SyncStatus>` returns connection state, record count, and last sync time.

The sync batch must carry stable source identifiers so records can be updated instead of duplicated. A failed batch must be retryable without creating duplicate learners.

### `MessageProvider`

- `sendTemplate(input)` sends an approved template with recipient, parameters, and an idempotency key.
- The implementation must return a provider message ID for delivery tracking.
- Opted-out recipients must not be sent messages.

### `ProjectsApi`

- `listUpcoming()` returns the caller’s permitted project feed.
- `publishProject(draft)` validates and publishes a project.
- `markStarted(projectId)` records the parent acknowledgement.

The browser should depend on these domain operations rather than provider-specific SDK details.

## 9. Testing and acceptance checklist

### Application behavior

- Teacher can create and publish a valid project.
- Invalid or missing title, description, and due date are rejected clearly.
- Parent sees only projects relevant to their linked learner.
- Filtered project lists remain correct on desktop and mobile.
- “Mark as started” is idempotent and reversible if that behavior is retained.

### Authorization and privacy

- A parent cannot read another learner’s project feed.
- A teacher cannot access another school’s records.
- A revoked guardian loses access immediately or at the documented session boundary.
- Sensitive data is absent from logs, URLs, and analytics payloads.

### Notifications

- Publication creates one outbox event per eligible recipient.
- 14-day, 7-day, and 3-day reminders are scheduled correctly.
- Retry behavior never duplicates a notification.
- Cancellation and opt-out prevent future reminders.
- Provider callbacks update delivery state.

### SA-SAMS sync

- New learners are inserted once.
- Existing learners update by school plus source ID.
- Removed/inactive learners are deactivated rather than destructively deleted.
- Missing files, malformed data, and missing required columns produce actionable errors.
- Interrupted syncs can resume or safely retry.

### Release checks

- `npm run build` passes.
- Staging data is synthetic or explicitly authorized.
- RLS tests pass before live learner data is imported.
- School export, revocation, and deletion procedures are tested.
- One pilot support person can diagnose sync and messaging failures.

## 10. Risks and mitigations

| Risk | Mitigation | Pilot gate |
| --- | --- | --- |
| SA-SAMS schema varies between schools | Keep mappings school-specific and preserve source IDs | Real backup inspected and mapping tested |
| Windows Access driver problems | Detect prerequisites, provide clear installer diagnostics, and retain CSV fallback | Agent installs and syncs on the pilot PC |
| WhatsApp template/provider delays | Start provider setup early and keep adapter replaceable | Approved templates and delivery callback verified |
| Incorrect guardian relationships | Require school confirmation and verified parent onboarding | Sample family links reviewed by school admin |
| POPIA exposure | RLS, consent, audit, retention, deletion, and processor agreement | School approves data-processing workflow |
| Duplicate reminders | Unique outbox key plus idempotent provider requests | Retry tests pass |
| Support burden | Visible sync status, logs, manual retry, and runbook | Friendly-school operator can recover common failures |
| Poor parent phone data | Validate numbers and report uncontactable families to school admin | Contact list quality reviewed before launch |

## 11. Pilot metrics

Track weekly:

- Invited families.
- Activated families and activation percentage.
- Project message acceptance and delivery rates.
- Project view and “started” acknowledgement rates.
- Teacher project creation time.
- Sync success rate and duration.
- Failed messages and opt-outs.
- Support incidents by category.
- Weekly active teachers and parents.
- Qualitative parent and teacher feedback.
- Willingness to pay after the term.

The pilot should not be judged on feature count. The core evidence is whether teachers publish early and whether families act before the due date.

## 12. Local development and repository workflow

Install and run the current frontend:

```bash
npm install
npm run dev
```

Verify a production build:

```bash
npm run build
```

Repository conventions:

- Work from `main` unless a feature branch is needed for a larger change.
- Do not commit `.env` files, credentials, learner exports, `.mdb` backups, or generated directories.
- Keep product decisions in `PRODUCT.md`, visual decisions in `DESIGN.md`, setup information in `README.md`, and operational status/roadmap information here.
- Keep real school data out of fixtures and local debugging output.
- Run the build before pushing frontend changes.

## 13. Change log

| Date | Change |
| --- | --- |
| 31 Jul 2026 | Created the React/Vite/TypeScript projects-first pilot with teacher and parent preview flows. |
| 31 Jul 2026 | Added product/design context, Supabase schema foundation, and integration contracts. |
| 31 Jul 2026 | Initialized Git on `main`, connected GitHub origin, and pushed commit `2d81a9f`. |
| 31 Jul 2026 | Added this project context document. |

Update this document when a major product decision changes, an integration becomes live, scope is added or removed, a pilot metric changes, or the security/deployment posture changes.
