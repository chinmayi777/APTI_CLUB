# Apti Club — Frontend

A responsive React/Vite frontend prototype for a Gen-Z placement preparation platform. It includes an academic-themed 3D hero with floating books, larger typography, dark/light mode, resource library, event registration, archive, USN-based demo signup/login, role-based admin and coordinator pages, event creation, attendance marking and an improved website-aware Apti Bot. Students see their greeting and event registrations on the home page.

## Requirements
- Node.js 18.18+ (Node 20 LTS recommended)
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the URL printed by Vite (normally http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```
The production bundle is generated in `dist/`. Serve this directory using Nginx or your college web server. Configure SPA fallback so unknown routes serve `index.html`.

## Demo walkthrough
1. Open Login → Create account. Use a sample USN such as `4XX23CS001` and a password of at least 6 characters.
2. Browse Resources and Events. Register for an event while signed in as a student.
3. Return to the home page to see your greeting and registered events.
4. Sign out, then choose the **Admin** demo role on Login to open `/admin` and create/delete events.
5. Choose **Event Coordinator** on Login to open `/coordinator` and mark registered students Present or Absent.
6. Toggle the sun/moon icon to switch theme. Try Apti Bot with questions such as “What is today’s date and time?”, “Which events am I registered for?”, “Show my attendance”, “What upcoming events are available?”, “Show DBMS resources” or “What did I ask earlier?”.

## Important prototype boundary
This is the **frontend-first functioning prototype**. Data is persisted in browser `localStorage`; the demo role picker is intentionally exposed for preview. Passwords are not securely stored and this must not be used with real student credentials. There is no MySQL connection, server-side JWT validation, real role authorization, multi-user synchronization, permanent image storage, or AI/LLM-powered chatbot yet. Apti Bot currently uses website data and predefined intent matching in the browser; it can answer the supported questions about the current app data but is not a general-purpose AI assistant. Those belong in the next backend phase. When the API is added:
- Replace localStorage auth with server-issued JWT stored using a secure strategy (prefer HttpOnly, Secure, SameSite cookies).
- Enforce roles and ownership in Express middleware; never trust a client role.
- Hash passwords with bcrypt/argon2 and validate USNs server-side.
- Store event poster files on server/object storage and persist their paths in MySQL.
- Move registration capacity checks and attendance updates into database transactions.
- Add audit fields for attendance coordinator and timestamp.

## Structure
```text
src/
  components/   Header, footer, chatbot, 3D scene, resource card
  pages/        Home, Resources, Events, Archive, About, Auth,
                Admin, Coordinator
  context.jsx   Prototype app state + localStorage persistence
  data.js       Curated resource links and demo events
  utils.js      Date formatting
  App.jsx       Routes and page transitions
  styles.css    Theme tokens, responsive design and UI
```

## Notes
- 3D hero requires WebGL. On devices without WebGL the rest of the site remains usable.
- Google Fonts are loaded remotely; self-host them if the college network blocks Google Fonts.
- Demo event posters use Unsplash image URLs. Replace with approved campus event images before production.
