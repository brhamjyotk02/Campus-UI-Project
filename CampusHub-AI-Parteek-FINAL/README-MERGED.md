# CampusHub AI — Integrated Team Project

This project combines the main academic workflow with Mannatbir's Campus Life & Community module.

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally http://localhost:5173).

## Demo accounts

- Student: `student@campushub.local` / `student123`
- Teacher: `teacher@campushub.local` / `teacher123`

## Integrated modules

### Academic workflow
- Student dashboard, timetable and subject details
- Attendance view and teacher attendance marking
- Notes, assignments, focus timer and notifications
- Teacher dashboard, timetable, students and profile

### Campus Life & Community — Mannatbir
- Clubs: search/category filters, join/leave, detail pages and club events
- Events: date/category filters, registration, seat counts and detail pages
- Complaints: submit, track and update demo statuses
- Campus Assistant: data-backed answers about community activity and shared demo academic data
- Campus profile: XP, levels, skills, projects, certificates and achievements
- Async loading/error/retry states, localStorage persistence and light/dark toggle

## Data / backend note

This is a frontend prototype. Authentication, academic records and community actions currently use browser localStorage or local JSON demo data. It is not connected to a production SQL database or a real push-notification service. The community module loads its demo data from `public/data/*.json`.

## Teacher names

- Java / OOP: Kajal Sharma
- FEE II: Niket Gupta
- DBMS and Discrete faculty names remain placeholders until confirmed.

## Verification status

Source syntax, local import paths, and the integrated community CSS were checked. A production Vite build could not be run in this environment because dependency installation timed out and the archived `node_modules` contained native binaries for a different platform. On your machine, run `npm install` followed by `npm run build` to verify the local installation.

## Latest integration update (25 Oct 2026)
- Added the Campus Directory page to the student route at `/directory` and added it to the student sidebar.
- Updated the timetable to support both Daily View and Weekly View using the existing CampusHub timetable data.
- Kept the existing CampusHub login, role-protected routing, attendance records, subject detail route, notifications, clubs, events, and other modules rather than replacing the app with the standalone CampusMate demo router.
- The pasted code's directory, timetable, subject detail, dashboard, and attendance concepts are integrated/adapted to the current app architecture. The standalone `CampusMate` `App.jsx` was not copied over because it would create a second `BrowserRouter` and replace CampusHub's existing routes.
- Validation: 79 JavaScript/JSX files parsed with Babel with zero syntax errors or unresolved relative imports. A production Vite build could not be verified in this environment because the provided dependency folder is missing Rollup's `@rollup/rollup-linux-x64-gnu` optional package.
