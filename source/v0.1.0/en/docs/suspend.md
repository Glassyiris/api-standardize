---
title: Suspend
---

# POST /api/suspend

Suspends the proxy service. This is equivalent to running `dae suspend` from the command line.

## Request

```http
POST /api/suspend HTTP/1.1
Host: localhost:9527
Content-Length: 0
```

## Response

### Success (200 OK)

```json
{
  "ok": true,
  "message": "Service suspended"
}
```

### Error (500 Internal Server Error)

```json
{
  "ok": false,
  "error": "Failed to suspend service"
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
curl -X POST http://localhost:9527/api/suspend
```

> **Note:** To resume the service, use the `dae resume` command from the command line or restart the dae service.
