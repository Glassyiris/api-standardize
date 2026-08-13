---
title: Connections
---

# GET /api/connections

Returns a list of active TCP and UDP connections.

## Request

```http
GET /api/connections HTTP/1.1
Host: localhost:9527
```

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| type | string | all | Filter: `tcp`, `udp`, or `all` |
| limit | int | 100 | Max connections to return |

## Response

### Success (200 OK)

```json
{
  "tcp": [
    {
      "src": "192.168.1.100:12345",
      "dst": "1.2.3.4:443",
      "outbound": "proxy",
      "started": "2026-08-13T12:00:00Z"
    }
  ],
  "udp": [
    {
      "src": "192.168.1.100:5353",
      "dst": "8.8.8.8:53",
      "outbound": "direct",
      "started": "2026-08-13T12:00:05Z"
    }
  ],
  "total_tcp": 42,
  "total_udp": 128
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| tcp | array | Active TCP connections |
| udp | array | Active UDP sessions |
| total_tcp | int | Total active TCP count |
| total_udp | int | Total active UDP count |

### Connection Object

| Field | Type | Description |
|-------|------|-------------|
| src | string | Source address (ip:port) |
| dst | string | Destination address (ip:port) |
| outbound | string | Outbound group name |
| started | string | Connection start time (RFC3339) |

## Example

```bash
curl "http://localhost:9527/api/connections?type=tcp&limit=10"
```
