---
title: Suspend
---

# POST /api/operations/suspend

> Draft endpoint. Suspension is capability-gated and asynchronous. It is not
> a universal dae/honk operation.

Starts suspension for an adapter that implements a no-load lifecycle.

## Request

```http
POST /api/operations/suspend HTTP/1.1
Host: localhost:9527
Content-Type: application/json

{}
```

## Response

### Accepted (202 Accepted)

```json
{
  "operation_id": "suspend-123",
  "status": "queued"
}
```

Poll `GET /api/operations/{id}` for completion.

### Completed result

```json
{
  "operation_id": "suspend-123",
  "status": "succeeded",
  "runtime_state": "suspended",
  "finished_at": "2026-08-15T10:01:00Z",
  "error": null
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| operation_id | string | Suspension operation identifier. |
| status | string | `queued`, `running`, `succeeded`, or `failed`. |
| runtime_state | string or null | `suspended` after a successful operation. |
| finished_at | string or null | Completion timestamp (RFC3339). |
| error | string or null | Redacted failure reason, when present. |

If the adapter advertises `supports_resume`, resume uses:

```http
POST /api/operations/resume HTTP/1.1
Host: localhost:9527
Content-Type: application/json

{}
```

An unsupported suspend or resume operation returns `409 operation_not_supported`.

## Example

```bash
curl -X POST http://localhost:9527/api/operations/suspend \
  -H 'Content-Type: application/json' \
  -d '{}'
```
