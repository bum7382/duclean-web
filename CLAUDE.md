# DuClean Web (Frontend)

Vite + React frontend for the DuClean alarm log dashboard. The frontend project is in `vite-project/`.

## Backend

The backend lives in `~/duclean-backend/` (Express + MongoDB + MQTT). It runs on **port 3000** by default (`PORT` env). All endpoints below are served from there.

When you need backend context (schema details, MQTT behavior, etc.), read `~/duclean-backend/server.js` directly — don't guess.

## API Reference

### `GET /api/logs`
Fetch alarm logs. Supports filtering and pagination.

**Query parameters** (all optional):
- `mac` — partial match (case-insensitive regex) on `mac_address`
- `ip` — exact match on `ip_address`
- `serial` — partial match (case-insensitive regex) on `serial`
- `page` — page number (default `1`, min `1`)
- `limit` — page size (default `100`, max `500`)

**Response:**
```json
{
  "data": [
    {
      "mac_address": "FC:B4:67:CC:61:D0",
      "ip_address": "192.168.0.10",
      "timestamp": "2026-04-25T10:00:00.000Z",
      "stop_timestamp": "2026-04-25T10:05:00.000Z",
      "status": 1,
      "active": false,
      "serial": "D123-2345"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 5432,
    "totalPages": 55
  }
}
```

**Notes:**
- Sorted by `timestamp` desc (newest first).
- `stop_timestamp` only exists on rows where `active === false` (alarm has been cleared).
- `active` and `status` filtering is **client-side**, not backend. Fetch with mac/ip/serial, then filter in React state.

### `GET /api/devices`
List all registered devices (MAC ↔ serial mapping).

**Response:**
```json
{
  "data": [
    { "mac_address": "FC:B4:67:CC:61:D0", "serial": "D123-2345" }
  ]
}
```

**Notes:**
- Sorted by `mac_address` asc.
- Device collection is small (one entry per physical device). Fetch once, filter on the client.

### `GET /api/serial/:mac`
Look up a single device's serial by MAC. Useful when you already know the exact MAC.

**Response (found):** `{ "success": true, "serial": "D123-2345" }`
**Response (not found):** `{ "success": false, "message": "등록된 시리얼 번호가 없습니다." }`

### `POST /api/serial`
Register or update a MAC ↔ serial mapping. Also back-fills the serial on all existing `AlarmLog` rows with that MAC.

**Body:** `{ "mac": "FC:B4:67:CC:61:D0", "serial": "D123-2345" }`
**Response:** `{ "success": true, "message": "...", "updatedLogs": <number> }`

## Data Model (reference)

**AlarmLog** (`alarm` collection — TTL: 30 days from `timestamp`):
- `timestamp` (Date, required) — when the alarm fired
- `stop_timestamp` (Date) — when the alarm was cleared (only on `active: false` rows)
- `mac_address` (String, indexed)
- `ip_address` (String, indexed)
- `status` (Number) — alarm code
- `active` (Boolean, indexed) — `true` = still firing, `false` = cleared
- `serial` (String, optional)

**Device** (devices collection):
- `mac_address` (String, unique)
- `serial` (String)

## Frontend Conventions

- API base URL: read from env (e.g. `VITE_API_BASE_URL`). Default to `http://localhost:3000` in dev.
- For lists with many rows (logs), paginate via `page`/`limit` and render only the current page.
- For active/status narrowing, keep the fetched page in state and filter in JS.
