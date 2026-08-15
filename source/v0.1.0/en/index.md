---
title: dae/honk Native API Documentation
---

# dae/honk Native API Documentation

Welcome to the dae/honk API documentation. This site defines a proposed native
HTTP JSON control plane for Linux transparent-proxy engines and documents the
existing Clash-compatible surface separately.

## Overview

dae and honk are Linux eBPF transparent-proxy engines. The native API allows a
client to:

- Monitor real-time traffic statistics
- Discover engine capabilities and datapath visibility
- Read sanitized runtime, configuration, routing, node, group, and DNS state
- Start typed probes without conflating TCP reachability with proxy latency
- Track asynchronous reload/suspend operations
- Observe only the connections and counters the running datapath can actually see

All requests and responses use **JSON** (`Content-Type: application/json`). No other formats are supported.

## Quick Start

### Configuration

The draft native listener uses `/api`. honk currently
configures its Clash-compatible listener with `experimental.clash_api`; the
referenced dae/kdae branch currently has no general REST listener and exposes
reload/suspend through CLI and signals. See [API Configuration](docs/api-config)
for the proposed shared listener contract.

```
experimental {
    clash_api {
        external_controller: '127.0.0.1:9090'
        secret: 'use-a-random-secret'
    }
}
```

The native listener is loopback-only by default. See [API Configuration](docs/api-config)
for the shared listener, authentication, and CORS contract.

### Base URL

```
http://localhost:9527/api     # native API draft
http://localhost:9090         # honk Clash compatibility API
```

### Authentication

If a bearer secret is configured, include it in requests:

```
Authorization: Bearer <your-token>
```

> **Note for frontend developers:** If you store the token in a cookie, make sure the token is not leaked. Serve the API over HTTPS and set the cookie with `Secure`, `HttpOnly` and `SameSite=Strict`, and never expose the token in URLs, logs, or client-side scripts.

## API Version

Native API status: **draft**

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api` | Native API discovery |
| GET | `/api/version` | Native engine version and API identity |
| GET | `/api/capabilities` | Feature and visibility negotiation |
| GET | `/api/runtime` | Runtime, active generation, eBPF summary, and visible counters |
| GET | `/api/datapath` | Detailed eBPF/datapath state and visibility |
| GET | `/api/config` | Sanitized active configuration |
| PATCH | `/api/config` | Atomic partial configuration update |
| GET | `/api/nodes` | Nodes and typed health samples |
| GET | `/api/groups` | List group summaries |
| GET | `/api/groups/{groupId}` | Current group configuration, members, selection, and health |
| PATCH | `/api/groups/{groupId}` | JSON Patch group configuration |
| PUT | `/api/groups/{groupId}/selection` | Select a runtime member when supported |
| POST | `/api/probes` | Start a typed node or group probe job |
| GET | `/api/connections` | Scope-labelled connection snapshot |
| GET | `/api/dns/query` | Routed DNS query |
| GET | `/api/dns/cache` | DNS cache view when supported |
| DELETE | `/api/dns/cache/{entry_id}` | Delete one DNS cache entry |
| DELETE | `/api/dns/cache?name=...` | Delete matching entries for one exact name |
| POST | `/api/dns/cache/flush` | Flush the complete runtime DNS cache |
| POST | `/api/operations/reload` | Asynchronous reload operation |
| POST | `/api/operations/suspend` | Capability-gated asynchronous suspend |
| POST | `/api/operations/resume` | Capability-gated asynchronous resume |
| GET | `/api/operations/{id}` | Operation status |
| GET | `/version`, `/configs`, `/proxies`, ... | honk Clash compatibility surface |
