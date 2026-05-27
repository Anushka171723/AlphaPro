# Alpha Dashboard

Responsive admin & product management interface built with React + Vite.

Alpha Dashboard provides a role-based product catalog and management UI with URL-synced filters, analytics, and persisted column customization (show/hide + drag-and-drop). This project was implemented as a front-end internship assignment and is optimized for clarity, performance, and easy deployment.

## Features
- Role-based access: `user` (published-only) and `admin` (full catalog + management)
- URL state sync: search, filters, sort, and pagination appear in the URL
- Product listing: grid and table views with pagination
- Product detail pages with image carousel and stats
- Analytics dashboard with charts and summary cards
- Publish controls (admin): toggle product visibility
- Column customization: show/hide and drag-and-drop reorder (persisted in localStorage)
- Performance: debounced search, memoized lists, lazy routes and images

## Tech stack
- React 18 + Vite
- react-router-dom, Tailwind CSS
- axios for data fetching
- recharts for analytics
- @dnd-kit for drag-and-drop
- lucide-react for icons

## Quick start (local)
1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Build production bundle

```bash
npm run build
```

4. Preview production build

```bash
npm run preview
```

## Deployment (Vercel recommended)
- Import the repository into Vercel.
- Build command: `npm run build`
- Output directory: `dist`
- No special environment variables required.

## Local storage keys
- `alpha-product-columns-user` / `alpha-product-columns-admin` — column prefs (order + visibility)
- `alpha-product-visibility` — published state overrides
- `alpha-auth-user` — mock auth session

## URL examples
- Example filters and sort encoded in URL: `/products?category=electronics&rating=4&sort=price`

## Notes
- Data source: https://dummyjson.com/products (fetched via `axios`)
- If you want CI/CD, connect this repo to Vercel and enable automatic deploys from the main branch.

## Contributing
Open issues or PRs for improvements. If you want me to push this repo to GitHub and deploy, tell me the desired repository name and whether you want me to create it under your account.

---
_Contact me for final screenshots or a live demo link._
# Alpha Dashboard

React + Vite admin dashboard for the front-end internship assignment.

## Features

- Responsive dashboard layout with sidebar, top bar, and profile section
- Login with two roles: admin and user
- URL-synced product search, filters, sorting, and pagination
- Product detail page with image carousel
- Admin analytics with charts and product visibility toggles
- Performance optimizations with debounce, memoization, and lazy loading

## Run locally

```bash
npm install
npm run dev
```

## Login roles

- User: `user@alpha.com`
- Admin: `admin@alpha.com`

## Deployment

Deploy the app with Vercel by connecting the repository and using the default Vite build settings.

Build command: `npm run build`
Output directory: `dist`