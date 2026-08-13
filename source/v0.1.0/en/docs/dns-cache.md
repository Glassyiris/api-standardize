---
title: DNS Cache
---

# GET /api/dns/cache

Returns DNS cache entries.

## Request

```http
GET /api/dns/cache HTTP/1.1
Host: localhost:9527
```

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| domain | string | - | Filter by domain (partial match) |
| limit | int | 100 | Max entries to return |

## Response

### Success (200 OK)

```json
{
  "entries": [
    {
      "domain": "example.com",
      "type": "A",
      "answer": "93.184.216.34",
      "ttl": 3600,
      "deadline": "2026-08-13T13:00:00Z"
    },
    {
      "domain": "google.com",
      "type": "A",
      "answer": "142.250.80.46",
      "ttl": 300,
      "deadline": "2026-08-13T12:05:00Z"
    }
  ],
  "total": 1024
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| entries | array | DNS cache entries |
| total | int | Total cached entries |

### Entry Object

| Field | Type | Description |
|-------|------|-------------|
| domain | string | Domain name |
| type | string | Record type (A, AAAA, CNAME, etc.) |
| answer | string | DNS answer |
| ttl | int | Time to live (seconds) |
| deadline | string | Cache expiration time (RFC3339) |

## Example

```bash
curl "http://localhost:9527/api/dns/cache?domain=google"
```
