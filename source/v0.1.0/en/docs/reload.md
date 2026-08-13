---
title: Reload
---

# POST /api/reload

Triggers a configuration reload. This is equivalent to running `dae reload` from the command line.

## Request

```http
POST /api/reload HTTP/1.1
Host: localhost:9527
Content-Length: 0
```

## Response

### Success (200 OK)

```json
{
  "ok": true,
  "message": "Reload triggered"
}
```

### Error (500 Internal Server Error)

```json
{
  "ok": false,
  "error": "Failed to reload configuration"
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| ok | bool | Whether the operation succeeded |
| message | string | Human-readable message (on success) |
| error | string | Error message (on failure) |

## Example

```bash
curl -X POST http://localhost:9527/api/reload
```

> **Note:** Reload is an asynchronous operation. Use `GET /api/runtime/stats` or `GET /api/config` to verify the new configuration is active.
