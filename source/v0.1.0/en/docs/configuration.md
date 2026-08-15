---
title: Configuration
---

# GET /api/config

> Draft endpoint. Use `GET /api/config`.
> The native response is engine-neutral, generation-aware, and sanitized. It
> does not expose Go runtime fields or credentials.
> Native partial updates use `PATCH /api/config` with JSON Patch and require
> the resource `ETag` in `If-Match`.

Returns the current active configuration (read-only) for an adapter that keeps
this legacy path.

## Request

```http
GET /api/config HTTP/1.1
Host: localhost:9527
```

## Response

### Success (200 OK)

```json
{
  "api": {
    "port": 9527
  },
  "global": {
    "log_level": "info"
  },
  "groups": [
    {
      "name": "proxy",
      "policy": "random"
    }
  ],
  "routing": {
    "rules": []
  }
}
```

### Fields

The response mirrors the dae configuration file structure. See [dae documentation](https://dae.universe.ingress/) for full field details.

> **Note:** This endpoint returns a sanitized view of the configuration. Sensitive fields like `api.token` are not included in the response.

## Example

```bash
curl http://localhost:9527/api/config
```
