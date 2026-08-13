---
title: Groups
---

# GET /api/groups

Returns information about all configured node groups and their nodes.

## Request

```http
GET /api/groups HTTP/1.1
Host: localhost:9527
```

## Response

### Success (200 OK)

```json
[
  {
    "name": "proxy",
    "policy": "random",
    "nodes": [
      {
        "name": "node1",
        "alive": true,
        "latency_ms": 45
      },
      {
        "name": "node2",
        "alive": true,
        "latency_ms": 120
      }
    ]
  },
  {
    "name": "direct",
    "policy": "fixed",
    "nodes": [
      {
        "name": "direct",
        "alive": true,
        "latency_ms": 5
      }
    ]
  }
]
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| name | string | Group name |
| policy | string | Selection policy (random, fixed, etc.) |
| nodes | array | List of nodes in this group |
| nodes[].name | string | Node name |
| nodes[].alive | bool | Whether node is reachable |
| nodes[].latency_ms | int64 | Node latency (ms) |

## Example

```bash
curl http://localhost:9527/api/groups
```
