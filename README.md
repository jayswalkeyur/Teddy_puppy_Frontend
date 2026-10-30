# TeddyPups Frontend

React 18 + Vite + JSX frontend refactored into a feature-based architecture and integrated with the supplied TeddyPups Express API.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- TeddyPups backend running locally on port `5000`
- A configured MongoDB database seeded with the supplied puppy records

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` to the backend API base URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Build and preview:

```bash
npm run build
npm run preview
```

## Backend

The frontend uses the API contract implemented by the supplied Node.js + Express + TypeScript backend:

| Feature | Method | Endpoint |
|---|---|---|
| Public puppy listing | GET | `/puppies?page=1&limit=50` |
| Featured puppies | GET | `/puppies/featured` |
| Puppy details | GET | `/puppies/:slug` |
| Puppy enquiry | POST | `/enquiries` |
| Contact message | POST | `/contact` |

The backend base path is `/api/v1`. Responses use `{ success, message?, data }`; list responses also include `pagination`.

The frontend sends the original form field names. `puppyId` is the frontend UUID (`Puppy.publicId`), not the MongoDB ObjectId. The backend resolves it and stores the internal reference. The `website` field remains a honeypot and is never persisted by the backend.

## Architecture

- `src/app`: store, route table and app-level setup
- `src/components/common`: reusable loader, error and empty states
- `src/components/layout`: shared layout boundary
- `src/features/puppies`: listing, profile, card, grid, gallery and API workflows
- `src/features/enquiries`: puppy enquiry submission workflow
- `src/features/contact`: contact submission workflow
- `src/services/api`: shared Axios instance and endpoint definitions
- `src/pages`: static captured content pages
- `src/styles` and `src/style.css`: existing site styles and scoped API feedback styles

## Visual and behavior preservation

The original captured page markup, class names, image/font assets, CSS files, animation keyframes and transition declarations are retained. Shared React components adapt repeated puppy cards, listing grids and photo galleries without rebuilding their original DOM content. Existing gallery, lightbox, mobile navigation, video and page navigation behavior is maintained by the app interaction layer.

Static content pages remain static because the backend does not expose a CMS API for those sections. The 11 supplied puppy profile routes share one `PuppyProfile` renderer while retaining their route-specific captured content.

## Known source limitations

- The supplied frontend archive contains 18 page modules and 11 individual puppy profile modules. Some links in the captured markup point to additional puppy profiles whose page modules were not supplied.
- The backend seed includes 11 published puppy records and four unpublished contact-only reference records. Public puppy APIs correctly omit the unpublished records; the captured listing still contains some additional cards without matching public profile modules. Those original cards are retained rather than silently deleted.
- The backend seed deliberately does not invent unverified ages or dates of birth. The frontend keeps the captured age copy when the API does not provide age.
- Admin endpoints exist in the backend, but this frontend has no admin dashboard. No admin token is persisted in localStorage.
- Build/browser QA must be run in an environment where npm dependencies can be installed and the backend/MongoDB are available.

See `docs/ARCHITECTURE.md`, `docs/API_INTEGRATION.md` and `docs/QA_REPORT.md`.
