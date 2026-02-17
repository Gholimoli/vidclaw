import { listAgents, resolveAgentId } from '../lib/agentContext.js';

export function getAgents(req, res) {
  const agents = listAgents();
  const selected = resolveAgentId(req);
  res.json({
    selected,
    agents,
  });
}

