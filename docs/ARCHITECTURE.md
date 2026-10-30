# Frontend Architecture

## Application flow

`main.jsx` owns URL normalization, browser history navigation, route-level data loading, and the delegated interaction bridge. The existing route behavior is retained instead of adding a second router.

## Route/page composition

- `src/app/routes.js` is the single route registry.
- General captured pages live in `src/pages`.
- The captured puppy listing lives in `src/features/puppies/pages/PuppiesCapturedPage.jsx`.
- Eleven profile modules live in `src/features/puppies/pages/profiles`.
- Each profile module supplies its own captured content to the shared `PuppyProfile` renderer.

## Reusable UI

- `Header`, `Footer` and `MainLayout` are shared layout adapters; they preserve the exact captured site chrome and route wrapper.
- `Modal` adapts native dialogs without replacing browser `showModal`/`close` behavior.
- `PuppyCard` adapts the existing `.tp-sketch` anchor card without changing its child markup or CSS classes.
- `PuppyGrid` adapts the existing `ul.tp-sketches` listing structure.
- `PuppyGallery` adapts the existing thumbnail list; existing gallery click behavior remains in the page interaction layer.
- `Loader`, `ErrorMessage`, and `EmptyState` provide common asynchronous states.
- `PuppyEnquiryForm` and `ContactForm` are separate React form components with distinct backend contracts. Their original captured form markup remains intact and is submitted by the shared form bridge.

## State management

Redux Toolkit stores server-owned puppy listing, featured puppy, and profile data, plus enquiry/contact submission state. Transient UI state (dialog open, selected gallery thumbnail, etc.) stays in the DOM interaction layer and is not stored globally.

## Styling rule

Original CSS is authoritative. Tailwind Preflight remains disabled. New API state styles are scoped in `src/style.css`; existing captured classes and animation selectors are not renamed.
