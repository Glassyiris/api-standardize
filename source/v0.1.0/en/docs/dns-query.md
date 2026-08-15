---
title: DNS Query
---

# GET /api/dns/query

> Draft endpoint. Use `GET /api/dns/query`.
> A response must identify the selected upstream and route source. It must not
> claim proxy usage when DNS routing selected direct.

Performs a live DNS query through the configured DNS module for debugging.

## Request

```http
GET /api/dns/query?domain=example.com&type=A&type=AAAA HTTP/1.1
Host: localhost:9527
```

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| domain | string | - | Domain name to query (required) |
| type | string | A | IANA record type mnemonic such as `A`, `AAAA`, `HTTPS`, `SVCB`, `SRV`, `CNAME`, `MX`, `TXT`, `NS`, `SOA`, or `PTR`; numeric types are allowed when unknown qtypes are advertised. May be specified multiple times (e.g. `&type=A&type=AAAA`) |
| upstream | string | - | Force a specific upstream defined in `dns.upstream` (e.g. `alidns`). If omitted, the upstream is chosen by `dns.routing` |
| cache_mode | string | normal | `normal` reads and writes the runtime cache; `bypass` reads from upstream and neither reads nor writes the cache |

## Response

### Success (200 OK)

```json
{
  "domain": "example.com",
  "types": [
    "A",
    "AAAA"
  ],
  "cache_mode": "normal",
  "cached": false,
  "cache_hits": [
    {
      "type": "A",
      "hit": false
    },
    {
      "type": "AAAA",
      "hit": false
    }
  ],
  "cache_entry_ids": [
    {
      "type": "A",
      "entry_id": "dns-entry-01HZX4K8W5"
    },
    {
      "type": "AAAA",
      "entry_id": "dns-entry-01HZX4K8W6"
    }
  ],
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
| cache_mode | string | Cache behavior used for this query |
| cached | bool | `true` only when every requested type was served from the DNS cache |
| cache_hits | array | Per-type cache-hit status for multi-type queries |
| cache_entry_ids | array | Cache entry IDs by requested type; empty for `bypass` or an uncacheable result |
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
