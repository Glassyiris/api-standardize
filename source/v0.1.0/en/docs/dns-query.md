---
title: DNS Query
---

# GET /api/dns/query

Performs a live DNS query through the dae DNS module for debugging. The query is resolved using the configured `dns.upstream` servers and evaluated against the `dns.routing` rules, exactly like a real DNS request handled by dae.

## Request

```http
GET /api/dns/query?domain=example.com&type=A&type=AAAA HTTP/1.1
Host: localhost:9527
```

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| domain | string | - | Domain name to query (required) |
| type | string | A | Record type: `A`, `AAAA`, `CNAME`, `MX`, `TXT`, `NS`, `SOA`, `PTR`. May be specified multiple times (e.g. `&type=A&type=AAAA`) to query several record types in a single request |
| upstream | string | - | Force a specific upstream defined in `dns.upstream` (e.g. `alidns`). If omitted, the upstream is chosen by `dns.routing` |

## Response

### Success (200 OK)

```json
{
  "domain": "example.com",
  "types": [
    "A",
    "AAAA"
  ],
  "cached": false,
  "upstream": "alidns",
  "status": "NOERROR",
  "elapsed_ms": 12,
  "query_time": "2026-08-14T00:00:00Z",
  "question": [
    {
      "name": "example.com.",
      "type": "A"
    },
    {
      "name": "example.com.",
      "type": "AAAA"
    }
  ],
  "answers": [
    {
      "name": "example.com.",
      "type": "A",
      "class": "IN",
      "ttl": 600,
      "data": "93.184.216.34"
    },
    {
      "name": "example.com.",
      "type": "AAAA",
      "class": "IN",
      "ttl": 600,
      "data": "2606:2800:220:1:248:1893:25c8:1946"
    }
  ]
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| domain | string | Query domain name |
| types | array | Requested record types |
| cached | bool | Whether the answer was served from the DNS cache |
| upstream | string | Upstream that served the query (after routing) |
| status | string | DNS response code: `NOERROR`, `NXDOMAIN`, `SERVFAIL`, `FORMERR`, `REFUSED`, etc. |
| elapsed_ms | int | Query round-trip time (ms) |
| query_time | string | Timestamp of the query (RFC3339) |
| question | array | DNS question section |
| answers | array | DNS answer records |

### Question Object

| Field | Type | Description |
|-------|------|-------------|
| name | string | Fully-qualified domain name |
| type | string | Record type |

### Answer Object

| Field | Type | Description |
|-------|------|-------------|
| name | string | Record name |
| type | string | Record type |
| class | string | DNS class (usually `IN`) |
| ttl | int | Time to live (seconds) |
| data | string | Record data |

### Errors

#### 400 Bad Request

Returned when `domain` is missing or `type` is invalid.

```json
{
  "ok": false,
  "error": "Invalid domain name"
}
```

#### 502 Bad Gateway

Returned when all matched upstreams failed to resolve the domain.

```json
{
  "ok": false,
  "error": "All DNS upstreams failed"
}
```

## Example

```bash
curl "http://localhost:9527/api/dns/query?domain=example.com&type=A"
curl "http://localhost:9527/api/dns/query?domain=example.com&type=A&type=AAAA"
curl "http://localhost:9527/api/dns/query?domain=example.com&upstream=googledns"
```
