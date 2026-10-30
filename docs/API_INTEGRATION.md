# API Integration Mapping

Base URL: `VITE_API_BASE_URL` (local default `http://localhost:5000/api/v1`).

| Feature | Frontend entry | Method | Backend endpoint |
|---|---|---|---|
| Public puppy listing | `fetchPuppies` / `PuppiesPage` | GET | `/puppies?page=1&limit=50` |
| Featured puppy query | `fetchFeaturedPuppies` | GET | `/puppies/featured` |
| Puppy profile | `fetchPuppyBySlug` / `PuppyProfile` | GET | `/puppies/:slug` |
| Puppy enquiry | `submitPuppyEnquiry` / `FormSubmissionBridge` | POST | `/enquiries` |
| Contact message | `submitContactMessage` / `FormSubmissionBridge` | POST | `/contact` |

## Response contract

The backend returns `{ success: true, message?, data }`. Puppy list responses additionally return `pagination`. The Redux thunks normalize the response into the feature state.

## Puppy enquiry payload

`name`, `phone`, `email`, `area`, `puppyId`, `message`, `website`.

- `puppyId` is the captured form UUID, matching `Puppy.publicId`.
- The backend resolves `publicId` to MongoDB `_id` and snapshots the puppy name/slug.
- The hidden `website` honeypot is sent empty and is not persisted.
- Success feedback is shown only after the backend returns success.

## Contact payload

`name`, `phone`, `email`, `area`, `puppyId`, `message`, `website`.

- `puppyId` may be an empty string for “any puppy”.
- Selected puppy UUIDs are passed unchanged.
- Contact form schema and endpoint remain distinct from puppy enquiry.

## Authentication

The public frontend uses only public endpoints. The backend admin endpoints require a bearer token, but no admin UI is included. The frontend does not read or persist access tokens in localStorage. The backend does not implement a refresh-cookie flow in this release.


## Verified profile UUID mapping

| Profile route slug | `puppyId` / backend `publicId` |
|---|---|
| `maltipoo-max-male` | `4218427a-dd65-4b09-a089-584b912aa7ab` |
| `korean-teacup-maltipoo-female` | `0abcf3f5-0080-44c1-b1e1-2a2de24a3cf4` |
| `korean-teacup-poodle-female` | `c5d2cf3c-51e8-4ecf-ac94-97ef8fceb6ec` |
| `maltipoo-cavapoo-male` | `9cb7d6db-bf35-4e63-8e61-ca63e1925dbd` |
| `toy-poodle-male-female` | `b39adb3f-eace-45af-a2e8-425de01ffc50` |
| `maltipoo-female-2` | `027d7333-a8b2-49de-9bbc-9a47af88ebac` |
| `pomeranian-female` | `ec3a42bf-bd62-46ba-962d-8f94f09715c5` |
| `copper-male` | `e486e544-f1fd-48f9-8ba0-f556d7ee44e7` |
| `shitzu-female` | `d2d146b2-6454-4e05-967a-87f2ab02946d` |
| `shitzu-male` | `0fe92eee-1937-48e1-b48b-77292a6f25d8` |
| `korean-teacup-pomeranian-male` | `e838ce49-59e0-4f3e-ab83-55cd2d98d2a2` |

The 15 UUID values in the contact form select were also checked against the backend seed records; all 15 resolve to seeded public IDs. Four are unpublished contact-only references and therefore are intentionally not returned by public puppy listing APIs.
