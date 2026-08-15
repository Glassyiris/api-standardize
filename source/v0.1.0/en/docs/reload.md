---
title: Reload
---

# POST /api/operations/reload

> Draft endpoint. Reload is capability-gated and asynchronous. Queueing a
> reload is not proof that a new generation was validated and published.

Starts a configuration reload operation.

## Request

```http
POST /api/operations/reload HTTP/1.1
Host: localhost:9527
Content-Type: application/json

{}
```

## Response

### Accepted (202 Accepted)

```json
{
  "operation_id": "reload-123",
  "status": "queued"
}
```

Poll `GET /api/operations/{id}` for completion.

### Completed result

```json
{
  "operation_id": "reload-123",
  "status": "succeeded",
  "active_generation_id": "generation-42",
  "datapath_generation_id": "generation-42",
  "finished_at": "2026-08-15T09:30:00Z",
  "error": null
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| operation_id | string | Reload operation identifier. |
| status | string | `queued`, `running`, `succeeded`, or `failed`. |
| active_generation_id | string or null | Generation active after completion. |
| datapath_generation_id | string or null | Generation published to the datapath. |
| finished_at | string or null | Completion timestamp (RFC3339). |
| error | string or null | Redacted failure reason, when present. |

An operation may report `succeeded` only after configuration validation,
datapath routing publication, and active-generation promotion all complete.
When reload fails, the previous active generation remains active.

## Example

```bash
curl -X POST http://localhost:9527/api/operations/reload \
  -H 'Content-Type: application/json' \
  -d '{}'
```
