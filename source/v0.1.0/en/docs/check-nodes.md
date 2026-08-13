---
title: Check Nodes
---

# POST /api/nodes/check

Triggers an immediate latency check for all nodes.

## Request

```http
POST /api/nodes/check HTTP/1.1
Host: localhost:9527
Content-Length: 0
```

## Response

### Success (200 OK)

```json
{
  "ok": true,
  "message": "Latency check triggered"
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| ok | bool | Whether the operation succeeded |
| message | string | Human-readable message |

## Example

```bash
curl -X POST http://localhost:9527/api/nodes/check
```
