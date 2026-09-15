---
title: Connections
---

# GET /api/v1/connections

> Draft endpoint. Real-direct flows can bypass userspace, so this list is not
> necessarily a complete packet-flow inventory. Native responses label
> `observed_by` and use `null` when a counter is unavailable.

Returns a list of visible TCP and UDP connections, including per-connection
network speeds where the observation plane provides them.

## Request

{% api_request listConnections %}

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| type | string | all | Filter: `tcp`, `udp`, or `all` |
| limit | int | 100 | Max connections to return across both arrays; capped at 1000. |
| detail | string | summary | `summary` omits `src`, `dst`, and `domain`; `full` includes them when observable. |

## Response

### Success (200 OK)

{% api_example listConnections 200 visible %}

### Fields

| Field | Type | Description |
|-------|------|-------------|
| observed_at | string | Snapshot timestamp (RFC3339). |
| instance_id | string | Running adapter instance; resets on process restart. |
| visibility | string | `full`, `partial`, or `none`. |
| truncated | bool | Whether `limit` omitted visible entries. |
| tcp | array | Active TCP connections |
| udp | array | Active UDP sessions |
| total_tcp | int | Total active TCP count |
| total_udp | int | Total active UDP count |

### Connection Object

| Field | Type | Description |
|-------|------|-------------|
| id | string | Opaque connection identifier |
| flow_id | string or null | Related recorded-flow ID, if correlation is known; not derived from a tuple. |
| pname | string or null | Captured process name; null without process context. Included in summary. |
| state | string | Observed lifecycle state from the flow contract, or unknown. |
| src | string, optional | Source address (ip:port), present with `detail=full` |
| dst | string, optional | Destination address (ip:port), present with `detail=full` |
| domain | string or null, optional | Sniffed domain with `detail=full`, or `null` when unknown |
| outbound | string or null | Effective routed outbound, not a leaf name masquerading as a group. |
| started_at | string or null | Actual start time if recorded; null if only post-dial registration time is known. |
| observed_by | string | `userspace`, `ebpf`, or `mixed` |
| upload_bytes | decimal uint64 string or null | Visible uploaded bytes |
| download_bytes | decimal uint64 string or null | Visible downloaded bytes |
| upload_bytes_per_second | decimal uint64 string or null | Visible upload rate |
| download_bytes_per_second | decimal uint64 string or null | Visible download rate |

> **Note:** Overall visible network speed and connection totals are available
> from [`GET /api/v1/runtime`](runtime-status.html). The datapath may observe only a
> subset of host traffic.

When both arrays exceed `limit`, the server returns the most recently observed
entries first with a stable tie-breaker and sets `truncated: true`. Totals are
the complete counts visible at `observed_at`, not only the returned array sizes.

Summary reduces payload; it does not confer less-sensitive access. `pname`,
addresses and domains all require `observe`. Per-flow DNS provenance, actual
leaf/member paths, and decision-time inputs are at
[`GET /api/v1/flows/{flow_id}`](flows.html), not reconstructed from this list.

Totals count visible live entries after the `type` filter (the excluded
transport has count zero); absence from this snapshot is not evidence of a
clean close. Failed/blocked attempts and recently terminated flows belong to
`/flows`. In particular, removing a tracker entry is not a transport
cancellation. No native close endpoint is defined by this draft.

## Example

```bash
curl "http://localhost:9527/api/v1/connections?type=tcp&limit=10&detail=full"
```
