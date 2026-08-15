---
title: Probes
---

# POST /api/probes

> Draft endpoint. Probes are explicit about their target, kind, transport,
> address family, and warmth. A group target is the native group latency-test
> operation.

Starts a bounded asynchronous probe job for a node or group.

## Request

```http
POST /api/probes HTTP/1.1
Host: localhost:9527
Content-Type: application/json

{
  "target": {
    "type": "group",
    "group_id": "group-proxy"
  },
  "kind": "latency",
  "transport": ["tcp", "udp"],
  "ip_version": "any",
  "members": "direct",
  "warmth": "cold"
}
```

### Request fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| target.type | string | yes | `node` or `group`. |
| target.node_id | string | conditional | Required when `target.type` is `node`. |
| target.group_id | string | conditional | Required when `target.type` is `group`. |
| kind | string | yes | Probe kind. The group latency operation uses `latency`. |
| transport | string array | yes | One or more supported transports, such as `tcp` or `udp`. |
| ip_version | string | yes | `ipv4`, `ipv6`, or `any`. |
| members | string or array | no | Group targets only: `direct`, `leaves`, or explicit member IDs. Defaults to `direct`. |
| warmth | string | yes | `cold` or `warm`, describing whether an existing connection may be reused. |

For a group target, `direct` preserves direct node and nested group members.
When a nested group is tested, the result identifies both the requested member
and the resolved leaf node. `leaves` expands nested groups for diagnostics and
deduplicates the same leaf node.

The probe uses the engine's configured health-check target and native policy
semantics. It may change an automatic selection. The completed result reports
`selection_changed`, `selection_before`, and `selection_after` when the engine
exposes those values.

## Response

### Accepted (202 Accepted)

```json
{
  "operation_id": "probe-123",
  "status": "queued",
  "target": {
    "type": "group",
    "group_id": "group-proxy"
  }
}
```

Poll `GET /api/operations/{id}` for completion.

### Completed result

```json
{
  "operation_id": "probe-123",
  "status": "succeeded",
  "selection_changed": true,
  "selection_before": "node-us-01",
  "selection_after": "node-hk-01",
  "results": [
    {
      "member_id": "node-hk-01",
      "resolved_leaf_node_id": "node-hk-01",
      "transport": "tcp",
      "ip_version": "ipv4",
      "state": "healthy",
      "latency_ms": 45,
      "observed_at": "2026-08-15T10:00:00Z"
    },
    {
      "member_id": "group-jp",
      "resolved_leaf_node_id": "node-jp-01",
      "transport": "udp",
      "ip_version": "ipv4",
      "state": "unavailable",
      "latency_ms": null,
      "error": "udp_probe_timeout",
      "observed_at": "2026-08-15T10:00:00Z"
    }
  ]
}
```

### Result fields

| Field | Type | Description |
|-------|------|-------------|
| operation_id | string | Probe operation identifier. |
| status | string | `queued`, `running`, `succeeded`, or `failed`. |
| selection_changed | bool | Whether the native policy changed a selection during the probe. |
| selection_before | string or null | Selection before the probe, when available. |
| selection_after | string or null | Selection after the probe, when available. |
| results | array | One typed result per requested member, transport, and IP version. |
| results[].member_id | string | Direct group member or node that the caller targeted. |
| results[].resolved_leaf_node_id | string or null | Actual leaf node tested for a group member. |
| results[].transport | string | Transport tested. |
| results[].ip_version | string | IP family tested. |
| results[].state | string | `healthy`, `unavailable`, or `unknown`. |
| results[].latency_ms | number or null | Measured latency. Unknown or failed measurements are `null`, never `0`. |
| results[].observed_at | string | RFC3339 observation timestamp. |
| results[].error | string or null | Machine-readable failure reason, when present. |

## Example

```bash
curl -X POST http://localhost:9527/api/probes \
  -H 'Content-Type: application/json' \
  -d '{
    "target": {"type": "group", "group_id": "group-proxy"},
    "kind": "latency",
    "transport": ["tcp", "udp"],
    "ip_version": "any",
    "members": "direct",
    "warmth": "cold"
  }'
```
