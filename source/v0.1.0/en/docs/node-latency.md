---
title: Node Latency
---

# GET /api/nodes/latency

Returns latency information for all configured nodes.

## Request

```http
GET /api/nodes/latency HTTP/1.1
Host: localhost:9527
```

## Response

### Success (200 OK)

```json
[
  {
    "node": "node1",
    "group": "proxy",
    "latency_ms": 45,
    "alive": true,
    "last_check": "2026-08-13T12:00:00Z"
  },
  {
    "node": "node2",
    "group": "proxy",
    "latency_ms": 120,
    "alive": true,
    "last_check": "2026-08-13T12:00:00Z"
  },
  {
    "node": "node3",
    "group": "proxy",
    "latency_ms": 0,
    "alive": false,
    "last_check": "2026-08-13T11:59:30Z"
  }
]
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| node | string | Node name |
| group | string | Group name |
| latency_ms | int64 | Latency in milliseconds (0 if unknown) |
| alive | bool | Whether node is reachable |
| last_check | string | Last check timestamp (RFC3339) |

## Example

```bash
curl http://localhost:9527/api/nodes/latency
```
