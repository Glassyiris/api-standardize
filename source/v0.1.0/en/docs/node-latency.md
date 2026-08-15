---
title: Node Latency
---

# GET /api/nodes/latency

> Draft endpoint. Use `GET /api/nodes` and `POST /api/probes`. A failed
> measurement is `null` with a status
> and reason, never `0 ms`.

Returns the latest visible node measurements.

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
    "latency_ms": null,
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
| latency_ms | number or null | Latency in milliseconds; `null` if unknown or failed |
| alive | bool | Whether node is reachable |
| last_check | string | Last check timestamp (RFC3339) |

## Example

```bash
curl http://localhost:9527/api/nodes/latency
```
