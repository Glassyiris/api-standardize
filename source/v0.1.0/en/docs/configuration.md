---
title: Configuration (Deferred)
---

# Configuration (Deferred)

The canonical configuration resource is intentionally deferred. This draft
does not currently define `GET /api/v1/config` or `PATCH /api/v1/config` because a
shared shape must preserve each engine's configuration semantics without
exposing credentials or pretending one engine's file format is universal.

The current native contract exposes only configuration-adjacent state:

- `GET /api/v1/runtime` identifies the active generation and configuration
  revision.
- `PATCH /api/v1/groups/{groupId}` changes only fields explicitly listed by that
  group's capabilities.
- `POST /api/v1/operations/reload` asks the engine to load its engine-owned
  configuration.

Native configuration read/write/validate routes remain outside this revision.
This is not waiting for a neutral JSON schema: the safe future direction is
engine-native source text plus candidate validation using the engine's own
parser, preserving comments and includes.

That is **new work**, not a mapping of honk's current `/configs`. Its GET
returns Clash compatibility settings and metadata diagnostics, not original
`.dae` bytes; PUT does not validate a candidate. Raw source may include
proxy/subscription credentials, environment references and local include
paths. A round-trippable editor needs a separate privileged source boundary,
source-set revision/If-Match, bounded side-effect-free include handling, and
explicit validation versus apply semantics. Redacted text must never be
silently saved over the source.

This per-flow design does not add that editor or loosen `observe` to return
secrets. Existing engine/Clash configuration endpoints are not native
configuration capabilities. The current revision and decision-time rule
descriptions are sufficient for the trace contract.
