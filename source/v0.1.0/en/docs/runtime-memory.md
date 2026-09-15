---
title: Runtime Memory
---

# GET /api/v1/runtime/memory

> Draft endpoint. This is a lightweight, read-only memory snapshot intended for
> frequent dashboard polling. It does not enumerate connections or eBPF map
> entries.

Process, cgroup, and kernel memory are different scopes. Their values must not
be added together. An unsupported or unobservable metric is `null`, and an
unadvertised metric may be omitted or `null`. Decimal string `"0"` is a real measurement, never absence.

## Request

{% api_request getRuntimeMemory %}

Successful responses include `Cache-Control: no-store`.

## Response

### Success (200 OK)

{% api_example getRuntimeMemory 200 snapshot %}

### Fields

| Field | Type | Description |
|-------|------|-------------|
| observed_at | string | Snapshot timestamp (RFC3339). |
| process | object or null | Memory attributed to the engine process. |
| process.rss_bytes | decimal uint64 string or null, optional | Resident set size reported by the operating system. |
| cgroup | object or null | Effective cgroup memory accounting when available. |
| cgroup.scope | string | `service`, `shared`, or `unknown`. |
| cgroup.current_bytes | decimal uint64 string or null, optional | Current cgroup memory usage. |
| cgroup.limit_bytes | decimal uint64 string or null, optional | Effective hard limit; `null` when unlimited or unknown. |
| cgroup.events | object or null, optional | Counters from the effective cgroup memory controller; the container may be omitted when no event metrics are advertised. |
| cgroup.events.high | decimal uint64 string or null, optional | Number of times the high boundary was reached. |
| cgroup.events.oom | decimal uint64 string or null, optional | Number of observed allocation failures caused by cgroup OOM. |
| cgroup.events.oom_kill | decimal uint64 string or null, optional | Number of processes killed by the cgroup OOM killer. |
| kernel | object or null | Kernel memory attributable to the engine when observable. |
| kernel.ebpf_bytes | decimal uint64 string or null, optional | Memory attributable to eBPF maps and programs. |
| kernel.sampled_at | string or null | Timestamp of the cached kernel-memory sample. |

`process.rss_bytes`, `cgroup.current_bytes`, and `kernel.ebpf_bytes` have
different accounting scopes and may overlap. Clients must display them
separately.

An implementation must not walk every eBPF map entry in the request path.
Kernel memory may be sampled asynchronously and reused across requests;
`kernel.sampled_at` lets clients show that it is older than the process and
cgroup sample.

Go heap statistics, Rust allocator statistics, and the Clash-compatible
`memory` field are implementation-specific and are not canonical native fields.
Feature availability is advertised by `GET /api/v1/capabilities`.

Clients should not poll this resource more than once per second. Servers may
return `429` with `Retry-After` when the advertised rate limit is exceeded.
The `runtime_memory.metrics` capability lists every supported metric path;
unadvertised metrics may be omitted or `null`. Consumers must not substitute `"0"` for either case.

## Example

```bash
curl http://localhost:9527/api/v1/runtime/memory
```
