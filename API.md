# API Reference

All endpoints are served on `localhost:3333`.

## Agents (multi-agent)

VidClaw can operate on multiple OpenClaw agents by passing `agentId` as a query parameter.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agents` | List known agent IDs (from OpenClaw config + state dir) |

Endpoints that support `agentId`:

- `/api/usage`
- `/api/files*`
- `/api/soul*` and `/api/workspace-file*`
- `/api/calendar`

## Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| POST | `/api/tasks/:id/run` | Mark task for immediate execution |
| POST | `/api/tasks/:id/pickup` | Mark task as picked up by agent |
| POST | `/api/tasks/:id/complete` | Mark task as done with result |
| GET | `/api/tasks/queue` | Get executable task queue (sorted by priority) |

## Usage & Models

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/usage?agentId=` | Usage stats with rate limit percentages (per agent) |
| GET | `/api/models` | List available models (from openclaw.json) |
| POST | `/api/model` | Switch active model |

## Skills

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/skills` | List all skills with status |
| POST | `/api/skills/:id/toggle` | Enable/disable a skill |
| POST | `/api/skills/create` | Create a custom workspace skill |
| GET | `/api/skills/:id/content` | Read full SKILL.md content |
| DELETE | `/api/skills/:id` | Delete a workspace skill |

## Files

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/files?agentId=&path=` | List directory contents |
| GET | `/api/files/content?agentId=&path=` | Read file content |
| GET | `/api/files/download?agentId=&path=` | Download a file |

## Soul & Workspace Files

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/soul?agentId=` | Read SOUL.md |
| PUT | `/api/soul?agentId=` | Save SOUL.md (with version history) |
| GET | `/api/soul/history?agentId=` | Get SOUL.md version history |
| POST | `/api/soul/revert?agentId=` | Revert to a previous version |
| GET | `/api/soul/templates` | List persona templates |
| GET | `/api/workspace-file?agentId=&name=` | Read a workspace file |
| PUT | `/api/workspace-file?agentId=&name=` | Save a workspace file (with history) |

## Heartbeat

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/heartbeat` | Get last heartbeat timestamp |
| POST | `/api/heartbeat` | Record a heartbeat |

## Calendar

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/calendar?agentId=` | Get activity data from memory files (per workspace) |
