---
title: dae API Documentation
---

# dae API Documentation

Welcome to the dae API documentation. This provides a RESTful HTTP JSON API for monitoring and controlling the dae transparent proxy.

## Overview

dae is a high-performance transparent proxy based on Linux eBPF. The API allows you to:

- Monitor real-time traffic statistics
- Query node latency and health status
- View active connections and DNS cache
- Reload configuration
- Suspend/resume the proxy

## Quick Start

### Configuration

Add to your dae configuration file:

```
global {
    api_port 9527
    api_token "your-secret-token"  # Optional, for authentication
}
```

### Base URL

```
http://localhost:9527
```

### Authentication

If `api_token` is configured, include it in requests:

```
Authorization: Bearer <your-token>
```

## API Version

Current version: **v0.1.0**

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/version` | Version information |
| GET | `/api/runtime/stats` | Real-time traffic statistics |
| GET | `/api/nodes/latency` | Node latency |
| POST | `/api/nodes/check` | Trigger latency checks |
| GET | `/api/groups` | Node groups |
| GET | `/api/connections` | Active connections |
| GET | `/api/dns/cache` | DNS cache |
| GET | `/api/config` | Configuration |
| POST | `/api/reload` | Reload configuration |
| POST | `/api/suspend` | Suspend service |
