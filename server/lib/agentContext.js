import fs from 'fs';
import os from 'os';
import path from 'path';
import { OPENCLAW_DIR } from '../config.js';
import { readOpenclawJson } from './fileStore.js';

function expandHome(p) {
  if (!p) return p;
  if (p === '~') return os.homedir();
  if (p.startsWith('~/')) return path.join(os.homedir(), p.slice(2));
  return p;
}

function safeAgentId(input) {
  const id = String(input || '').trim();
  if (!id) return null;
  if (id.includes('/') || id.includes('..') || id.includes('\\')) return null;
  return id;
}

export function listAgentIdsFromDisk() {
  const agentsDir = path.join(OPENCLAW_DIR, 'agents');
  try {
    return fs
      .readdirSync(agentsDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .filter((id) => safeAgentId(id))
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

export function listAgents() {
  const cfg = readOpenclawJson();
  const fromConfig = Array.isArray(cfg?.agents?.list)
    ? cfg.agents.list
        .map((a) => ({
          id: safeAgentId(a?.id),
          name: typeof a?.name === 'string' ? a.name : null,
          workspace: typeof a?.workspace === 'string' ? a.workspace : null,
        }))
        .filter((a) => a.id)
    : [];

  const idsFromDisk = new Set(listAgentIdsFromDisk());
  const byId = new Map();

  for (const a of fromConfig) {
    byId.set(a.id, {
      id: a.id,
      name: a.name || a.id,
      workspace: a.workspace ? expandHome(a.workspace) : null,
      sessionsDir: path.join(OPENCLAW_DIR, 'agents', a.id, 'sessions'),
    });
    idsFromDisk.delete(a.id);
  }

  for (const id of [...idsFromDisk].sort((a, b) => a.localeCompare(b))) {
    byId.set(id, {
      id,
      name: id,
      workspace: null,
      sessionsDir: path.join(OPENCLAW_DIR, 'agents', id, 'sessions'),
    });
  }

  return [...byId.values()];
}

export function resolveAgentId(req) {
  const requested = safeAgentId(req.query.agentId);
  if (requested) return requested;
  const envDefault = safeAgentId(process.env.VIDCLAW_DEFAULT_AGENT_ID);
  return envDefault || 'main';
}

export function resolveAgentWorkspaceDir(agentId) {
  const id = safeAgentId(agentId) || 'main';
  const cfg = readOpenclawJson();
  const list = Array.isArray(cfg?.agents?.list) ? cfg.agents.list : [];
  const match = list.find((a) => safeAgentId(a?.id) === id);
  const workspace = typeof match?.workspace === 'string' ? expandHome(match.workspace) : null;
  // Fall back to the legacy default workspace dir.
  return workspace || path.join(OPENCLAW_DIR, 'workspace');
}

export function resolveAgentSessionsDir(agentId) {
  const id = safeAgentId(agentId) || 'main';
  return path.join(OPENCLAW_DIR, 'agents', id, 'sessions');
}

