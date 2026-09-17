# 3D Asset Review Board

A React and Three.js frontend against a Node backend: a board for reviewing
simple 3D assets before they are published. A team checks each asset before it
goes live, and every item moves through three stages:

**To review → In review → Approved**

This file covers setup, the project layout and the API. Tickets are tracked on
a Trello project board.

---

## 1. Setup

### Option A — Docker (recommended)

```bash
docker compose up
```

- Frontend: <http://localhost:5173>
- Backend:  <http://localhost:8080>

The first build pulls images and downloads dependencies, so allow a few minutes.
Your edits under `frontend/` hot-reload inside the container.

### Option B — run natively

Requires **Node 20.19+** (or 22.12+).

```bash
# terminal 1 — backend
cd backend
npm install
npm run dev

# terminal 2 — frontend
cd frontend
npm install
npm run dev
```

### Check it works

You should see the app shell with an empty, orbitable 3D viewport on the right.
Drag inside it to confirm the camera responds. This command should return JSON:

```bash
curl http://localhost:5173/api/items
```

If the Docker build stalls while pulling images, Option B is the faster way in.

---

## 2. Project layout

The 3D setup, the API client and the types are in place.

| Path | What it is |
| --- | --- |
| `src/three/useThreeScene.ts` | Renderer, camera, orbit controls, lighting, ground grid, resize handling, render loop and teardown. Exposes the scene plus `frameObject(object)`, which fits the camera to whatever you pass it. |
| `src/api/client.ts` | Typed API client with an `ApiError` carrying the HTTP status. |
| `src/types.ts` | Types for the API contract below. |
| `src/styles.css` | A baseline stylesheet. The class names are listed in a comment at the top. |
| `src/App.tsx` | Application root: header, board area and preview panel, and the selected-item state that connects them. |
| `src/components/ShapePreview.tsx` | Mounts the 3D scene into its container and shows a placeholder while nothing is selected. |

---

## 3. API reference

Base URL `/api` (the dev server proxies it to the backend, so there is no CORS
to deal with).

### `GET /api/statuses`

```json
[
  { "id": "TO_REVIEW", "label": "To review", "order": 0 },
  { "id": "IN_REVIEW", "label": "In review", "order": 1 },
  { "id": "APPROVED",  "label": "Approved",  "order": 2 }
]
```

### `GET /api/items`

```json
[
  {
    "id": "itm-001",
    "name": "Ventilation duct adapter",
    "description": "Transition piece between the riser shaft and the in-ceiling duct run.",
    "status": "TO_REVIEW",
    "submittedBy": "Planning Team A",
    "updatedAt": "2026-09-14T08:00:00Z",
    "geometry": { "type": "box", "width": 1.2, "height": 0.8, "depth": 2.4, "color": "#5b8def" }
  }
]
```

### `GET /api/items/{id}`

A single item, or `404` if it does not exist.

### `PATCH /api/items/{id}/status`

```jsonc
// request
{ "status": "IN_REVIEW" }
```

Returns the updated item. `400` if the status is not valid, `404` if the item is
not found.

### Geometry

Each item carries one geometry object, discriminated by `type`. Dimensions are in
metres.

| `type` | Fields |
| --- | --- |
| `box` | `width`, `height`, `depth` |
| `sphere` | `radius` |
| `cylinder` | `radiusTop`, `radiusBottom`, `height` |
| `cone` | `radius`, `height` |

All geometries also carry a `color` (hex string).

### Errors

Non-2xx responses share one shape, unwrapped by `ApiError`:

```json
{ "error": "404 NOT_FOUND", "message": "No item with id 'itm-999'" }
```

State lives in memory — restarting the backend resets everything to the seed data.
