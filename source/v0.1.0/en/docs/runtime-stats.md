---
title: Runtime Stats
---

# GET /api/runtime/stats

Returns real-time traffic statistics including upload/download rates, total bytes, and active connections.

## Request

```http
GET /api/runtime/stats HTTP/1.1
Host: localhost:9527
```

## Response

### Success (200 OK)

```json
{
  "upload_bytes": 123456789,
  "download_bytes": 987654321,
  "upload_rate": 1024000,
  "download_rate": 512000,
  "active_tcp": 42,
  "active_udp": 128,
  "tcp_total": 133,
  "udp_total": 128
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| upload_bytes | uint64 | Total bytes uploaded |
| download_bytes | uint64 | Total bytes downloaded |
| upload_rate | uint64 | Current upload rate (bytes/sec) |
| download_rate | uint64 | Current download rate (bytes/sec) |
| active_tcp | uint32 | Currently active TCP connections |
| active_udp | uint32 | Currently active UDP sessions |
| tcp_total | uint64 | Total TCP connections since start |
| udp_total | uint64 | Total UDP sessions since start |

## Example

```bash
curl http://localhost:9527/api/runtime/stats
```
