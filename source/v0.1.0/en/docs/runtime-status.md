---
title: Runtime Status
---

# GET /api/runtime/status

Returns the current runtime status of the dae instance, including memory usage, connection statistics, and real-time network speed.

## Request

```http
GET /api/runtime/status HTTP/1.1
Host: localhost:9527
```

## Response

### Success (200 OK)

```json
{
  "time": "2026-08-14T00:00:00Z",
  "uptime_seconds": 86400,
  "goroutines": 42,
  "memory": {
    "alloc_bytes": 33554432,
    "total_alloc_bytes": 134217728,
    "sys_bytes": 67108864,
    "heap_alloc_bytes": 33554432,
    "heap_sys_bytes": 41943040,
    "heap_inuse_bytes": 33554432,
    "stack_inuse_bytes": 1048576,
    "num_gc": 321,
    "last_gc_time": "2026-08-14T00:00:00Z"
  },
  "connections": {
    "active": {
      "tcp": 42,
      "udp": 128,
      "total": 170
    },
    "total": {
      "tcp": 1337,
      "udp": 4096,
      "grand_total": 5433
    }
  },
  "rates": {
    "upload_rate": 102400,
    "download_rate": 512000
  },
  "traffic": {
    "upload_bytes": 123456789,
    "download_bytes": 987654321
  }
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| time | string | Snapshot timestamp (RFC3339) |
| uptime_seconds | uint64 | Seconds since dae started |
| goroutines | int | Number of running goroutines |
| memory | object | Memory usage statistics |
| memory.alloc_bytes | uint64 | Bytes of allocated heap objects |
| memory.total_alloc_bytes | uint64 | Cumulative bytes allocated since start |
| memory.sys_bytes | uint64 | Total bytes obtained from the OS |
| memory.heap_alloc_bytes | uint64 | Bytes of currently live heap objects |
| memory.heap_sys_bytes | uint64 | Bytes of heap memory obtained from the OS |
| memory.heap_inuse_bytes | uint64 | Bytes of in-use heap spans |
| memory.stack_inuse_bytes | uint64 | Bytes of in-use stack memory |
| memory.num_gc | uint64 | Number of completed garbage collection cycles |
| memory.last_gc_time | string | Time of the last GC cycle (RFC3339) |
| connections.active.tcp | uint32 | Currently active TCP connections |
| connections.active.udp | uint32 | Currently active UDP sessions |
| connections.active.total | uint32 | Total active connections (TCP + UDP) |
| connections.total.tcp | uint64 | Total TCP connections since dae started |
| connections.total.udp | uint64 | Total UDP sessions since dae started |
| connections.total.grand_total | uint64 | Total connections (TCP + UDP) since dae started |
| rates.upload_rate | uint64 | Current upload speed (bytes/sec) |
| rates.download_rate | uint64 | Current download speed (bytes/sec) |
| traffic.upload_bytes | uint64 | Total bytes uploaded |
| traffic.download_bytes | uint64 | Total bytes downloaded |

> **Note:** Per-connection real-time network speeds are available from [`GET /api/connections`](connections.md).

## Example

```bash
curl http://localhost:9527/api/runtime/status
```
