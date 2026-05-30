# EIHA Recreational Hockey Registration System — MVP Specification

## 1. Overview & Problem Statement

The England Ice Hockey Association (EIHA) currently relies on a legacy registration system to manage recreational hockey player and team registrations. The system is built on an outdated school-based platform with a clunky, unintuitive user interface and poor searchability for both players and teams. While registration is the backbone of recreational hockey — ensuring players are insured and eligible to compete — the current tool makes this process cumbersome for administrators, team managers, and players alike.

This project proposes a modern, web-based replacement focused initially on the most critical workflow: **registering players for a season**. The MVP will be developed as a proof of concept (POC) to demonstrate the new system's value to stakeholders before any live player onboarding takes place.

## 2. Goals & Non-Goals

### Goals

- Deliver a clean, intuitive web application that handles the full player and team registration lifecycle.
- Provide each user group (association admins, team managers, players) with a dedicated portal that surfaces the information and actions relevant to them.
- Replace the legacy approval workflow with a parallel dual-approval model that is faster and clearer than the current sequential, opaque process.
- Build a foundation that is extensible to support future features (game creation, expanded admin roles, identity verification, etc.) without major rework.

### Non-Goals (Out of Scope for MVP)

- Live player onboarding — the MVP exists to demonstrate the system to stakeholders, not to handle real registrations.
- Real photo or ID document storage — these steps will exist in the user journey but the upload functionality will be stubbed.
- Integration with a third-party identity verification provider.
- Tracking of a player's previous team.
- Game creation, game submission, or any match-related functionality.
- Multiple association admin role types (the system will support a single admin role, but the data model should allow for future extension).
- Any process for challenging or correcting a player's self-declared playing category.
- Additional team-admin permissions beyond player registration approval.

## 3. Users & Roles

The system serves three primary user groups, listed in order of priority for the MVP design:

### 3.1 Association Administrators

The most senior users. They approve and administer all player and team registrations across the association. For the MVP there will be a single association admin role, though the underlying permission model should be built to support multiple admin types in future.

### 3.2 Team Managers

Each team has exactly one manager — the person who created the team. The manager is responsible for managing their team's profile and approving incoming player registrations. They can also promote existing players on their team to **team admin**, granting them specific permissions. For the MVP, the only assignable permission is "player registration approval", but the model should accommodate additional permissions (e.g. game creation, game submission) in future.

### 3.3 Players

Players register themselves for a team each season. They have a personal portal where they can see the status of pending and approved registrations.

## 4. Core Concepts

### 4.1 Seasons

- A season runs from **1 October to 30 September** of the following year.
- Seasons are labelled in `YY/YY` format — for example, the current season starting October 2025 is the **25/26** season.
- New seasons are created automatically on 1 October each year.

### 4.2 Playing Categories

Every player self-declares one playing category at registration. Selection is based on trust, and there is no challenge or correction process in the MVP.

**UK-Born Players**

- **Cat A** — Any UK-born player who has had no ice hockey experience, or has only ever played at a recreational level.
- **Cat B** — Any UK-born player who has had any junior league training or experience.
- **Cat C** — Any UK-born player who has had any adult league training or experience.

**Non-UK Born / Trained Players**

- **Cat A** — Any non-UK-born player who has had no ice hockey experience, or has only ever played at a recreational level.
- **Cat Z** — Any player receiving league training/experience as a junior, as a citizen of a country other than the UK.
- **Cat ZZ** — Any player receiving league training/experience as an adult, as a citizen of a country other than the UK.

### 4.3 Registration Fee

A flat fee applies to all players regardless of category, paid via Stripe at the point of submission.

## 5. User Journeys

### 5.1 Player Registration — New Player

1. Player visits the public registration page and chooses to register for a team.
2. Player fills in the registration form (see Section 6 for full data captured).
3. On submission:
   - An account is created for the player (magic-link based, see Section 7).
   - The Stripe payment is taken.
   - The registration is created in a **Pending** state, awaiting both team and association approval.
4. The player is taken to their personal portal, where they can see the pending registration.
5. The team manager (or a team admin with player-approval permission) and an association administrator each review the registration independently.
6. Once **both** parties have approved, the registration moves to **Approved** — the player is officially registered to that team for the current season.
7. If **either** party rejects with a comment (e.g. unclear photo), the registration moves to **Rejected**. The player sees the rejection reason in their portal, can amend the relevant fields, and resubmit. A resubmission requires both parties to re-approve from scratch.

### 5.2 Player Registration — Returning Player

A returning player is any player who has been registered in either of the previous two seasons.

1. Player logs into their existing account.
2. They initiate a renewal registration for the new season.
3. Their personal details and playing category are pre-populated and carry over automatically.
4. The player selects the team they are registering for this season and confirms the declarations.
5. Stripe payment is taken at the point of submission.
6. The same dual-approval workflow applies (team + association).

### 5.3 Team Registration

1. A prospective team manager visits the team registration section.
2. They submit the team registration form, which requires only a **team name**.
3. On submission:
   - An account is created for the user if they do not already have one.
   - The submitting user is set as the **team manager**.
   - The team registration is created in a **Pending** state, awaiting association approval.
4. The prospective manager is taken to their portal where they can see the pending team registration.
5. An association administrator reviews the team registration and either approves it or rejects it with a comment.
6. Once approved, the team becomes active and can begin receiving player registrations.

### 5.4 Team Management

Once a team is active, the team manager can:

- View the team's roster (pending, approved, and rejected players).
- Approve or reject incoming player registrations (with comments where relevant).
- Promote any registered player on the team to **team admin** and assign them specific permissions. For the MVP the only assignable permission is **player registration approval**.

## 6. Data Captured During Player Registration

### Player Details

- Name
- Date of birth
- Gender
- Country of birth
- Nationality
- Address
- Phone number
- Email

### Playing History

- Self-declared playing category (see Section 4.2).

### Player Registration

- Team being registered for.
- _(Future)_ Previous team — out of scope for MVP.

### Declarations

Both declarations are recorded as true/false acceptance flags. Placeholder declaration text will be used for the MVP and finalised later.

- Registration declaration
- Data protection declaration

### Detail Confirmation

- A summary screen where the player confirms all the above information is correct before submission.

### Photo & Identity

- Passport-style photo upload — **stubbed in MVP** (upload step present in the journey, but file is not persisted).
- ID document upload — **stubbed in MVP** for the same reason.

### Payment

- Stripe payment is taken at the point of submission, using Stripe test cards during the POC phase.

## 7. Technical Approach

### 7.1 Stack Summary

| Layer          | Choice                                              | Rationale                                                                                                |
| -------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Language       | TypeScript                                          | Aligns with developer skill set; strong typing across the stack.                                         |
| Framework      | Next.js (App Router)                                | Single full-stack codebase, mature ecosystem, excellent TypeScript support, large community for support. |
| Database       | PostgreSQL                                          | Relational data model maps naturally onto players, teams, registrations, and seasons.                    |
| ORM            | Prisma                                              | TypeScript-first ORM, auto-generated types, schema-driven migrations.                                    |
| Authentication | Magic link (passwordless) via NextAuth.js / Auth.js | Removes password management overhead; lightweight UX for a hobby-user base.                              |
| Payments       | Stripe                                              | Industry standard; test cards make POC development straightforward.                                      |
| File Storage   | Stubbed                                             | Real photo/ID handling deferred to a future third-party identity verification integration.               |

### 7.2 Rationale for Next.js

Next.js was chosen over Remix and a React + Vite + standalone backend setup primarily because:

- It offers a single project that handles both frontend and backend, simplifying development for a side project with one developer.
- The ecosystem around payments (Stripe), authentication (NextAuth.js), and Postgres tooling is the most mature of the options considered.
- The community is large, meaning more readily available examples and troubleshooting support — valuable for a POC being built in spare time.

Remix was a close second due to its form-handling strengths (which suit a form-heavy app like this) but was set aside because of its smaller ecosystem and reduced community support.

### 7.3 Identity & Document Handling

For the MVP, photo and ID uploads are deliberately stubbed because of GDPR and broader data protection concerns. Production implementation will integrate a specialist third-party identity verification provider (candidates include Onfido, Stripe Identity, Veriff, or Persona) that handles encryption, retention, and regulatory compliance on our behalf.

### 7.4 Extensibility Considerations

Although the MVP scope is intentionally tight, the following should be built with future extension in mind:

- The **association admin role** should be modelled as one role type within a wider role system, so additional admin tiers can be added without rework.
- The **team admin permission model** should be a flexible permission set, with "player registration approval" as the first defined permission. Future permissions (game creation, game submission, etc.) should slot in without schema changes.
- The **season model** should be generic enough that retention rules (e.g. "registered within the previous 2 seasons") can be queried against any past season.

## 8. Approval Workflow Detail

| State                | Description                                                                     |
| -------------------- | ------------------------------------------------------------------------------- |
| Pending              | Registration submitted; awaiting approval from both team and association.       |
| Team Approved        | Team has approved; still awaiting association approval.                         |
| Association Approved | Association has approved; still awaiting team approval.                         |
| Approved             | Both parties have approved. Player is officially registered.                    |
| Rejected             | One or both parties have rejected with comments. Player can amend and resubmit. |

Notes:

- Team and association reviews can happen in **parallel** — order does not matter.
- A rejection from either party puts the registration into the **Rejected** state and surfaces the rejection comment(s) in the player's portal.
- On resubmission after rejection, **both** parties must approve again from scratch — prior approvals are not retained.

## 9. Dependencies

- **Stripe account** with test mode enabled for the POC.
- **PostgreSQL instance** — for the POC a managed provider with a free tier (Supabase, Neon, or Railway) is suitable.
- **Email-sending service** for magic-link authentication (e.g. Resend, Postmark, or AWS SES).
- **Hosting** — Vercel is the natural deployment target for Next.js, though any Node-compatible host will work.

## 10. Risks & Mitigations

| Risk                                                                            | Mitigation                                                                                                                 |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| GDPR / data protection compliance, particularly around photos and ID documents. | Stub the upload functionality entirely in MVP; defer real handling to a specialist third-party provider.                   |
| Trust-based category self-selection could be misused.                           | Acknowledged as an MVP limitation. A future iteration may add an admin challenge/correction process.                       |
| Side project with no deadline — risk of scope creep.                            | Strict MVP scope is documented above; new ideas should be parked as future enhancements rather than absorbed mid-build.    |
| Sole-developer continuity risk.                                                 | Use of well-documented, popular tooling (Next.js, Prisma, Stripe) means future contributors can ramp up quickly if needed. |

## 11. Success Criteria

Success for the MVP is defined as **a successful demonstration to EIHA stakeholders** that showcases the full registration workflow end to end. The MVP is not expected to onboard real players; stakeholder feedback from the demo will inform the path to a production-ready system.

## 12. Open Questions

None outstanding at the time of writing. Items deferred to future phases are captured under Non-Goals (Section 2) and the future-permission notes in Section 3.2 and Section 7.4.

## 13. Future Enhancements (Beyond MVP)

Captured here for context, but explicitly out of scope for the MVP build:

- Previous team tracking on player registrations.
- Real photo and ID document handling via a third-party identity verification provider.
- Additional team admin permissions (game creation, game submission, etc.).
- Multiple association admin role types.
- Game and match management features.
- A process for admins to challenge or correct a player's self-declared category.
- Advanced search and filtering across players and teams (the legacy system's weakest area).
