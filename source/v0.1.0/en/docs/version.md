---
title: Version
---

# GET /api

> Draft endpoint. This is the canonical native API identity and engine version
> resource. Use `GET /api/capabilities` for feature negotiation and
> `GET /api/runtime` for live process state.

Returns the native API identity and the version of the running engine. The
response is independent of the engine implementation language.

## Request

```http
GET /api HTTP/1.1
Host: localhost:9527
```

## Response

### Success (200 OK)

```json
{
  "api": {
    "name": "dae/honk-native",
    "status": "draft"
  },
  "engine": {
    "name": "honk",
    "version": "0.0.1-alpha"
  }
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| api.name | string | Stable name of the native API surface. |
| api.status | string | Current API design status. The draft value is `draft`. |
| engine.name | string | Running engine name, such as `dae` or `honk`. |
| engine.version | string | Engine release or build version. It may be `unknown` when the build does not provide one. |

Build metadata is optional and must not be required by clients. If an engine
exposes it, the generic fields are `build.revision`, `build.target`, and
`build.built_at`; `build.built_at` uses RFC3339. Implementation-specific fields
such as `go_version` are not part of the native contract.

The native response must not reuse the Clash-compatible `/version` response.
For example, honk keeps its existing `version` string with the `honk ` prefix
and its dashboard compatibility flags on that separate endpoint.

## Example

```bash
curl http://localhost:9527/api
```
