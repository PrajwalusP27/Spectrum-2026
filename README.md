# SPECTRUM 2026 – The Student's Forum

Team registration website and private, read-only admin portal for the East West PU College sports event on 23 November 2026.

## Features

- Responsive public event website with Volleyball, Throwball and Carrom information.
- One application per team; multiple teams from each college are supported.
- Carrom validation requires exactly two named players in both browser and API.
- MongoDB-backed registrations with unique `SP26-` registration IDs.
- Public confirmation page that does not expose contact details or team member names.
- Admin sign-in backed by bcrypt password hashes and an HttpOnly JWT cookie.
- Read-only dashboard with live statistics, registration search, sport and college filters, date sorting, server pagination, details view and filtered CSV export.
- Helmet, restricted CORS, request size limits, rate limits, input validation, and safe error responses.

## Requirements

- Node.js 20 or later and npm.
- MongoDB Atlas database (or a compatible MongoDB deployment).

## Local setup

1. Install root tooling and each app's dependencies:

   ```sh
   npm install
   npm --prefix backend install
   npm --prefix frontend install
   ```

2. Copy `backend/.env.example` to `backend/.env` and configure:

   - `MONGODB_URI`: Atlas connection string. In Atlas, create a database user, allow the deployment IP in Network Access, and use the connection string from **Connect → Drivers**.
   - `JWT_SECRET`: a long random secret (at least 32 random bytes recommended).
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD`: the initial administrator credentials. Use a password with at least 12 characters.
   - `CLIENT_ORIGIN`: exact frontend origin, e.g. `http://localhost:5173`. Multiple origins can be comma-separated.
   - `COOKIE_DOMAIN`: optional; usually leave blank locally. For production, use a parent domain only when frontend and API share one.
- `TRUST_PROXY`: set to `1` when the API runs behind one trusted hosting proxy (such as Render) so rate limits use the client IP. Leave unset locally.
   - `PORT`: optional, defaults to `5000`.

3. Copy `frontend/.env.example` to `frontend/.env` if you need to change `VITE_API_URL` or add organizer contact details. `VITE_CONTACT_EMAIL` and `VITE_CONTACT_PHONE` are optional and intentionally blank until the organizers provide them. These Vite values are public.

4. Create or reset the admin account after MongoDB is configured:

   ```sh
   npm --prefix backend run create-admin
   ```

   There is no public admin registration endpoint. The command stores only a bcrypt hash.

5. Run frontend and backend together:

   ```sh
   npm run dev
   ```

   Or run them separately with `npm run dev:frontend` and `npm run dev:backend`. The public site is at `http://localhost:5173`; the API is at `http://localhost:5000/api`.

## Production deployment

### MongoDB Atlas

Create a database and least-privilege database user, allow your backend host's outbound IPs (or your chosen Atlas network policy), and set `MONGODB_URI` only in the backend host's secret environment variables.

### Backend (Render or similar)

- Root directory: `backend` (or deploy the repository root with a backend-specific build/start command).
- Build command: `npm install`
- Start command: `npm start`
- Configure `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_ORIGIN` with the exact Vercel site URL, and `PORT` if the host requires it.
- The production admin cookie uses `Secure` and `SameSite=None` for a separate Vercel frontend and API domain. Serve the API over HTTPS.
- Run `npm run create-admin` from the backend service shell once, or run it as a controlled one-off job with the same environment.

### Frontend (Vercel)

- Root directory: `frontend`.
- Build command: `npm run build`; output directory: `dist`.
- Set `VITE_API_URL` to the deployed API base URL including `/api`.
- Set `VITE_CONTACT_EMAIL` and `VITE_CONTACT_PHONE` only when organizers provide the real details.
- Add an SPA rewrite to `/index.html` if your Vercel project setup does not already provide one, so deep links such as `/register` and `/admin` resolve correctly.

## API overview

- `POST /api/registrations` – validate and create one team application.
- `GET /api/registrations/:registrationId` – safe confirmation fields only.
- `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/me` – admin session.
- `GET /api/admin/dashboard/stats` – live counts.
- `GET /api/admin/registrations` – authenticated, paginated list. Query: `search`, `sport`, `college`, `sort=asc|desc`, `page`, `limit`.
- `GET /api/admin/registrations/:id` – authenticated complete details.
- `GET /api/admin/registrations/export` – authenticated CSV using the same search/filter/sort parameters.
- `GET /api/health` – process health check.

No admin API supports editing, deleting, approving or rejecting a registration.

## Logo and contact details

The brief attachment contained no logo image file, so the header currently shows a lettermark fallback. Place the official unmodified logo at `frontend/public/images/spectrum-logo.png` (or update the reference if its actual extension differs). The existing brand container has a navy background and preserves image proportions. Contact details remain blank until set in the frontend environment.

## Verification

Use `npm run build` for the frontend production build and `npm --prefix backend run check` for backend syntax checks. The API requires a reachable configured MongoDB instance to start; registration persistence and admin access require valid Atlas credentials and an admin created with the command above.
