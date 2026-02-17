import React, { useState } from 'react'
import Layout from './components/Layout'
import Board from './components/Kanban/Board'
import CalendarView from './components/Calendar/CalendarView'
import FileBrowser from './components/Content/FileBrowser'
import SkillsManager from './components/Skills/SkillsManager'
import SoulEditor from './components/Soul/SoulEditor'
import SettingsPage from './components/Settings/SettingsPage'
import { TimezoneProvider } from './components/TimezoneContext'
import { SocketProvider } from './hooks/useSocket.jsx'
import { AgentProvider } from './components/AgentContext.jsx'

export default function App() {
  const [page, setPage] = useState('kanban')

  return (
    <SocketProvider>
      <TimezoneProvider>
        <AgentProvider>
          <Layout page={page} setPage={setPage}>
            {page === 'kanban' && <Board />}
            {page === 'calendar' && <CalendarView />}
            {page === 'files' && <FileBrowser />}
            {page === 'skills' && <SkillsManager />}
            {page === 'soul' && <SoulEditor />}
            {page === 'settings' && <SettingsPage />}
          </Layout>
        </AgentProvider>
      </TimezoneProvider>
    </SocketProvider>
  )
}
