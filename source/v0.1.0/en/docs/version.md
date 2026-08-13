---
title: Version
---

# GET /api/version

Returns version information about the dae instance.

## Request

```http
GET /api/version HTTP/1.1
Host: localhost:9527
```

## Response

### Success (200 OK)

```json
{
  "version": "0.1.0",
  "go_version": "go1.26",
  "build_time": "2026-08-13T00:00:00Z"
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| version | string | dae version |
| go_version | string | Go version used to build |
| build_time | string | Build timestamp (RFC3339) |

## Example

```bash
curl http://localhost:9527/api/version
```
