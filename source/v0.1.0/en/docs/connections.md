---
title: Connections
---

# GET /api/connections

> Draft endpoint. Use `GET /api/connections`.
> dae real-direct flows can bypass userspace, so this list is not necessarily a
> complete packet-flow inventory. Native responses label `observedBy` and use
> `null` when a counter is unavailable.

Returns a list of visible TCP and UDP connections, including per-connection
network speeds where the observation plane provides them.

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
      "id": 1,
      "src": "192.168.1.100:12345",
      "dst": "1.2.3.4:443",
      "domain": "example.com",
      "outbound": "proxy",
      "started": "2026-08-13T12:00:00Z",
      "upload_bytes": 20480,
      "download_bytes": 1048576,
      "upload_rate": 4096,
      "download_rate": 32768
    }
  ],
  "udp": [
    {
      "id": 2,
      "src": "192.168.1.100:5353",
      "dst": "8.8.8.8:53",
      "domain": "dns.google",
      "outbound": "direct",
      "started": "2026-08-13T12:00:05Z",
      "upload_bytes": 128,
      "download_bytes": 512,
      "upload_rate": 0,
      "download_rate": 0
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
| id | uint64 | Connection identifier |
| src | string | Source address (ip:port) |
| dst | string | Destination address (ip:port) |
| domain | string | Sniffed domain name (empty if unknown) |
| outbound | string | Outbound group name |
| started | string | Connection start time (RFC3339) |
| upload_bytes | uint64 | Bytes uploaded by this connection |
| download_bytes | uint64 | Bytes downloaded by this connection |
| upload_rate | uint64 | Real-time upload speed (bytes/sec) |
| download_rate | uint64 | Real-time download speed (bytes/sec) |

> **Note:** Overall visible network speed and connection totals are available
> from [`GET /api/runtime`](runtime-status). The datapath may observe only a
> subset of host traffic.

## Example

```bash
curl "http://localhost:9527/api/connections?type=tcp&limit=10"
```
