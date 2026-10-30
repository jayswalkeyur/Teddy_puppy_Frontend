# QA Report

## Static source checks completed

- Inspected the supplied frontend and backend ZIP archives.
- Confirmed 18 frontend page modules and 11 profile routes.
- Confirmed original frontend UUIDs against backend seed `publicId` values for all 11 supplied profiles.
- Confirmed puppy enquiry and contact field names against backend Joi validation.
- Confirmed public API route paths and response envelopes against backend routes/controllers.
- Preserved the existing page markup, image references, fonts, CSS files and route aliases.
- Checked 3,132 local image/poster/srcset references across all 18 captured page modules; 0 missing local files.
- Confirmed 18 canonical route entries and 11/11 profile UUID matches against backend seed `publicId` values; all 15 contact-select UUIDs also exist in the seed.
- Confirmed the original main captured stylesheet still contains 46 keyframe definitions and 63 transition declarations.
- Removed the local `.env` from the deliverable and added `.env.example`.
- Kept Tailwind Preflight disabled.

## Automated checks not completed

- `npm ci` did not finish in this execution environment because dependency installation timed out.
- Consequently `npm run build` could not be executed.
- Browser-based desktop/tablet/mobile visual regression and live API submission tests were not executable here because dependencies, a running backend and MongoDB connection were not available.

## Required local verification

1. Start MongoDB and configure backend `.env`.
2. Run backend `npm install`, `npm run build`, seed the puppy records, then `npm run dev`.
3. Run frontend `npm install`, set `VITE_API_BASE_URL=http://localhost:5000/api/v1`, then `npm run build` and `npm run dev`.
4. Verify all 18 canonical routes and `.html` aliases, including direct refresh and browser back/forward.
5. Submit a puppy enquiry on each of the 11 profile pages and verify `puppyPublicId`, `puppyName` and `puppySlug` in the stored record.
6. Submit the contact form with no puppy and with a selected puppy.
7. Compare original and refactored desktop/tablet/mobile layouts, animations, hover states, gallery, lightbox, mobile menu and video controls.

No build or browser test is marked passed unless it was actually run.
