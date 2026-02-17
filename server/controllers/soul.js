import fs from 'fs';
import path from 'path';
import { __dirname, SOUL_TEMPLATES } from '../config.js';
import { readHistoryFile, appendHistory } from '../lib/fileStore.js';
import { resolveAgentId, resolveAgentWorkspaceDir } from '../lib/agentContext.js';

export function getSoul(req, res) {
  const agentId = resolveAgentId(req);
  const WORKSPACE = resolveAgentWorkspaceDir(agentId);
  const fp = path.join(WORKSPACE, 'SOUL.md');
  try {
    const content = fs.readFileSync(fp, 'utf-8');
    const stat = fs.statSync(fp);
    res.json({ content, lastModified: stat.mtime.toISOString() });
  } catch { res.json({ content: '', lastModified: null }); }
}

export function putSoul(req, res) {
  const agentId = resolveAgentId(req);
  const WORKSPACE = resolveAgentWorkspaceDir(agentId);
  const fp = path.join(WORKSPACE, 'SOUL.md');
  const histPath = path.join(__dirname, 'data', `${agentId}-soul-history.json`);
  try {
    const old = fs.existsSync(fp) ? fs.readFileSync(fp, 'utf-8') : '';
    if (old) appendHistory(histPath, old);
    fs.writeFileSync(fp, req.body.content);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

export function getSoulHistory(req, res) {
  const agentId = resolveAgentId(req);
  res.json(readHistoryFile(path.join(__dirname, 'data', `${agentId}-soul-history.json`)));
}

export function revertSoul(req, res) {
  const agentId = resolveAgentId(req);
  const WORKSPACE = resolveAgentWorkspaceDir(agentId);
  const fp = path.join(WORKSPACE, 'SOUL.md');
  const histPath = path.join(__dirname, 'data', `${agentId}-soul-history.json`);
  const history = readHistoryFile(histPath);
  const idx = req.body.index;
  if (idx < 0 || idx >= history.length) return res.status(400).json({ error: 'Invalid index' });
  try {
    const current = fs.existsSync(fp) ? fs.readFileSync(fp, 'utf-8') : '';
    if (current) appendHistory(histPath, current);
    const content = history[idx].content;
    fs.writeFileSync(fp, content);
    res.json({ success: true, content });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

export function getSoulTemplates(req, res) {
  res.json(SOUL_TEMPLATES);
}
