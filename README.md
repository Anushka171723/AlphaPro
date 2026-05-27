# Alpha Dashboard

Modern admin and product management dashboard built with React and Vite.

## Features

- Responsive dashboard layout with sidebar, top navigation, and user profile section
- Role-based access for Admin and User views
- Product listing with:
  - Search
  - Multi-category filtering
  - Sorting
  - Pagination
- URL-synced search, filters, sorting, and pagination
- Product detail pages with image carousel and product insights
- Analytics dashboard with charts and inventory metrics
- Product visibility management for admin users
- Column customization:
  - Show/Hide columns
  - Reorder columns
  - Preferences persisted using localStorage
- Performance optimizations using:
  - Debounced search
  - Memoization
  - Lazy loading

## Tech Stack

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- Recharts
- DnD Kit
- Lucide React

## Run Locally

```bash
npm install
npm run dev
```

## Demo Accounts

### Admin
- Email: `admin@alpha.com`

### User
- Email: `user@alpha.com`

## Deployment

Deploy using Vercel with the default Vite configuration.

### Build Command

```bash
npm run build
```

### Output Directory

```bash
dist
```

## Data Source

https://dummyjson.com/products
