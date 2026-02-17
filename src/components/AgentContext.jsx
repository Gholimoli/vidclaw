import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AgentContext = createContext(null)

function safeAgentId(id) {
  if (!id) return null
  const s = String(id).trim()
  if (!s) return null
  if (s.includes('/') || s.includes('..') || s.includes('\\')) return null
  return s
}

export function AgentProvider({ children }) {
  const [agents, setAgents] = useState([])
  const [agentId, setAgentId] = useState(() => safeAgentId(localStorage.getItem('vidclaw.agentId')))

  useEffect(() => {
    let cancelled = false
    fetch('/api/agents')
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return
        const list = Array.isArray(d?.agents) ? d.agents : []
        setAgents(list)
        const defaultId = safeAgentId(d?.selected)
        const ids = new Set(list.map((a) => a.id))
        const stored = safeAgentId(localStorage.getItem('vidclaw.agentId'))

        if (stored && ids.has(stored)) {
          setAgentId(stored)
          return
        }
        if (agentId && ids.has(agentId)) {
          return
        }
        setAgentId(defaultId && ids.has(defaultId) ? defaultId : (list[0]?.id || 'main'))
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({
      agents,
      agentId: agentId || 'main',
      setAgentId: (id) => {
        const next = safeAgentId(id) || 'main'
        localStorage.setItem('vidclaw.agentId', next)
        setAgentId(next)
      },
    }),
    [agents, agentId],
  )

  return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>
}

export function useAgent() {
  const ctx = useContext(AgentContext)
  if (!ctx) throw new Error('useAgent must be used within AgentProvider')
  return ctx
}

export function withAgent(url, agentId) {
  const u = new URL(url, window.location.origin)
  u.searchParams.set('agentId', agentId || 'main')
  return u.pathname + u.search
}

