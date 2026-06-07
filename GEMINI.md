# Gram2City — Web Client

## Overview

Next.js 16 App Router frontend for the Gram2City logistics/parcel-delivery platform.  
Three user roles: **User**, **Rider**, **Admin** (+ Merchant sub-type).

**Root path**: `gram2city-web-client/`  
**Dev server**: `npm run dev` → http://localhost:3000  
**Package name**: `gram2city-client`

---

## Tech Stack

| Concern       | Library / Version                                |
| ------------- | ------------------------------------------------ |
| Framework     | Next.js 16 (App Router), React 19                |
| Language      | TypeScript 6                                     |
| Styling       | Tailwind CSS v4 + DaisyUI v5                     |
| Server state  | TanStack Query v5                                |
| Global state  | Zustand v5                                       |
| Forms         | React Hook Form + Zod v4                         |
| Auth          | Firebase client SDK v11                          |
| HTTP          | Axios                                            |
| Real-time     | Socket.io-client v4                              |
| Maps          | Leaflet + React-Leaflet + react-leaflet-cluster  |
| Payments      | `@stripe/react-stripe-js` + `@stripe/stripe-js`  |
| Animation     | Framer Motion, AOS                               |
| Charts        | Recharts                                         |
| Notifications | Sonner (preferred), React Hot Toast, SweetAlert2 |
| Icons         | Lucide React, React Icons, Heroicons             |

---

## Source Structure (`src/`)

```
src/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Login, register, forgot-password
│   ├── addParcel/        # New parcel form
│   ├── beARider/         # Rider application
│   ├── coverage/         # Coverage area map
│   ├── faqs/             # FAQ page
│   ├── forbidden/        # 403 role-check failure
│   ├── tracking/[id]/    # Public parcel tracking
│   └── dashboard/        # Role-based dashboard (24 sub-pages)
│       ├── addresses/
│       ├── adminFeedback/ / feedback/
│       ├── allParcels/
│       ├── applyMerchant/ / manage-merchants/ / merchantParcels/
│       ├── approvedRiders/ / pendingRiders/
│       ├── assignRider/
│       ├── completedDeliveries/ / pendingDeliveries/
│       ├── editParcel/
│       ├── financialSettings/
│       ├── landingPageManager/
│       ├── makeAdmins/
│       ├── messages/
│       ├── myEarnings/ / myParcels/ / parcels/
│       ├── payment/ / paymentHistory/
│       ├── trackParcel/
│       └── updateProfile/
├── api/                  # Axios instance + API call helpers
├── assets/               # Static assets (images, SVGs)
├── components/           # Shared UI components
├── features/             # Feature-scoped components & hooks
│   ├── admin/
│   ├── auth/
│   ├── chat/
│   ├── finance/
│   ├── landing/
│   ├── notifications/
│   ├── parcels/
│   ├── riders/
│   └── users/
├── firebase/             # Firebase client config & init
├── hooks/                # Custom React hooks
├── layouts/              # Shared layout wrappers
├── lib/                  # Utility/helper functions
├── routes/               # Route guards and helpers
├── store/                # Zustand stores
├── types.ts              # Shared TypeScript types
└── AuthInitializer.tsx   # Firebase auth state listener
```

---

## Key Conventions

- **Data fetching**: TanStack Query (`useQuery` / `useMutation`) — never `useEffect` for API calls
- **Global state**: Zustand stores in `src/store/`
- **API calls**: Centralized Axios instances in `src/api/`
- **Forms**: React Hook Form + Zod schema — never raw `useState` form fields
- **Notifications**: Prefer `sonner`, fallback `react-hot-toast`; use SweetAlert2 for confirmations
- **File naming**: camelCase for non-component files, PascalCase for React components
- **Env file**: `.env.local` — never commit secrets

---

## Auth Flow

1. Firebase client SDK handles email/password + Google sign-in
2. `AuthInitializer.tsx` listens for `onAuthStateChanged` and syncs to Zustand
3. Firebase ID token sent as `Authorization: Bearer <token>` on every API request
4. Role (`user` | `rider` | `admin`) is stored in MongoDB and returned from the server
5. Client-side role guards redirect to `/forbidden` on mismatch

---

## User Roles & Dashboard Pages

| Role         | Dashboard pages                                                                                                                                                            |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User**     | myParcels, addParcel, trackParcel, paymentHistory, payment, addresses, feedback, updateProfile                                                                             |
| **Rider**    | pendingDeliveries, completedDeliveries, myEarnings, messages, updateProfile                                                                                                |
| **Admin**    | allParcels, assignRider, approvedRiders, pendingRiders, makeAdmins, manage-merchants, merchantParcels, financialSettings, landingPageManager, adminFeedback, updateProfile |
| **Merchant** | merchantParcels, applyMerchant, paymentHistory, updateProfile                                                                                                              |

---

## Notes

- `components.json` present — shadcn/ui compatible (Radix primitives used: Dialog, Select)
- `firebase.json` + `.firebaserc` — client deployed to Firebase Hosting
- `next.config.ts` — minimal config, images not yet optimized externally
- The project was previously named **ZapShift**; package name is now `gram2city-client`
