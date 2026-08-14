---
title: API Configuration
---

# API Configuration

The API module is configured independently of the rest of the dae configuration. Its settings live in a top-level `api { }` block of the `.dae` file, separate from `global { }`. The block may also be placed in a separate included file (see the `include` section of the dae configuration) if you prefer to keep it isolated.

## Example `.dae`

```
api {
    # Port the HTTP API listens on.
    port: 9527

    # Interfaces to listen on. Manually enter interface names.
    # Supports comma-separated names, `*` wildcards and regular expressions.
    # If omitted, the API listens on the loopback interface only.
    interfaces: 'lo, eth*, ^(enp|eth)[0-9]+'

    # Bearer token. Generate one with:
    #   openssl rand -base64 16
    #   openssl rand -base64 32
    # Listening on any interface other than the loopback requires a valid token.
    token: 'q/RWNF0nPm2v3eD5LxD5VA=='
}
```

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| port | int | yes | Port the HTTP API listens on |
| interfaces | string | no | Comma-separated interface names. Names are entered manually and may contain `*` wildcards or regular expressions (e.g. `lo`, `eth*`, `^(enp|eth)[0-9]+`). If omitted, the loopback interface is used |
| token | string | no | Bearer token. Required for listening on any interface other than the loopback |

## Interface Examples

`interfaces` is a comma-separated list. Each entry is a manually entered interface name that may contain `*` wildcards or a regular expression:

| Example | Type | Matches |
|---------|------|---------|
| `lo` | exact name | only the `lo` interface |
| `eth0` | exact name | only the `eth0` interface |
| `eth*` | wildcard | `eth0`, `eth1`, `eth10` |
| `en*` | wildcard | `enp0s3`, `eno1`, `ens33` |
| `^(eth\|enp)[0-9]+` | regex | `eth0`, `enp0`, `enp12` |
| `^(wl\|wlan)[0-9]+` | regex | `wlan0`, `wlan1` |
| `lo, eth*, ^(enp)[0-9].*` | mixed | `lo`, `eth0`, `enp0s3`, ... |

Example configurations:

```
# Listen on the loopback and every ethernet interface.
api {
    port: 9527
    interfaces: 'lo, eth*'
    token: 'q/RWNF0nPm2v3eD5LxD5VA=='
}
```

```
# Listen on the loopback and every wireless interface (regex).
api {
    port: 9527
    interfaces: 'lo, ^(wl|wlan)[0-9]+'
    token: 'q/RWNF0nPm2v3eD5LxD5VA=='
}
```

## Token Generation

Generate a token with:

```bash
openssl rand -base64 16
openssl rand -base64 32
```

Alternatively, dae provides a built-in generator (`dae gen-token`) that produces a token in the same format.

## Token Validity

A token is considered **valid** only if it matches the format produced by `openssl rand -base64 16` or `openssl rand -base64 32`, i.e. the standard base64 encoding of exactly 16 or 32 random bytes:

| Source | Base64 length | Example |
|--------|---------------|---------|
| `openssl rand -base64 16` | 24 chars (ends with `==`) | `q/RWNF0nPm2v3eD5LxD5VA==` |
| `openssl rand -base64 32` | 44 chars (ends with `=`) | `0w5Vl0xR/mQY7r2tJzH3eFkC9qDxS+uN1vLbGPaQcXo=` |

Any other value is rejected.

## Interface Listening Rule

The API only listens on the loopback interface (`127.0.0.1` / `::1`) unless all of the following hold:

1. An `interfaces` list is configured, **and**
2. The configured `token` is valid.

Behavior:

| `interfaces` | `token` | Listened interfaces |
|--------------|---------|---------------------|
| omitted | any | loopback only |
| configured | missing or invalid | loopback only (a warning is logged) |
| configured | valid | all matching interfaces |

## Cookie Security

If a frontend stores the token in a cookie, developers must make sure the token is not leaked:

- Serve the API over HTTPS and set the cookie with `Secure`, `HttpOnly` and `SameSite=Strict`.
- Never include the token in URLs, logs, error messages, or client-side scripts.
- Prefer keeping the token in memory or sending it via the `Authorization: Bearer` header over cookies.
