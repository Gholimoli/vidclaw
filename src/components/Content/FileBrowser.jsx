import React, { useState, useEffect } from 'react'
import { Folder, File, ChevronRight, ArrowLeft, Download, Eye } from 'lucide-react'
import FilePreview from './FilePreview'
import { cn } from '@/lib/utils'
import { useAgent } from '../AgentContext.jsx'

export default function FileBrowser() {
  const [currentPath, setCurrentPath] = useState('')
  const [entries, setEntries] = useState([])
  const [preview, setPreview] = useState(null)
  const { agentId } = useAgent()

  useEffect(() => {
    const u = new URL('/api/files', window.location.origin)
    u.searchParams.set('agentId', agentId || 'main')
    u.searchParams.set('path', currentPath || '')
    fetch(u.pathname + u.search)
      .then(r => r.json())
      .then(setEntries)
      .catch(() => setEntries([]))
  }, [currentPath, agentId])

  function navigate(entry) {
    if (entry.isDirectory) {
      setCurrentPath(entry.path)
      setPreview(null)
    } else {
      setPreview(entry.path)
    }
  }

  function goUp() {
    const parts = currentPath.split('/').filter(Boolean)
    parts.pop()
    setCurrentPath(parts.join('/'))
    setPreview(null)
  }

  const breadcrumbs = currentPath ? currentPath.split('/') : []
  const downloadHref = (p) => {
    const u = new URL('/api/files/download', window.location.origin)
    u.searchParams.set('agentId', agentId || 'main')
    u.searchParams.set('path', p)
    return u.pathname + u.search
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      <div className={cn('flex flex-col border border-border rounded-xl bg-card/50 overflow-hidden', preview ? 'md:w-1/3 max-h-[50vh] md:max-h-none' : 'flex-1')}>
        <div className="flex items-center gap-2 p-3 border-b border-border text-sm">
          {currentPath && (
            <button onClick={goUp} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={16} />
            </button>
          )}
          <span className="text-muted-foreground">~/</span>
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              <ChevronRight size={12} className="text-muted-foreground" />
              <button
                onClick={() => setCurrentPath(breadcrumbs.slice(0, i + 1).join('/'))}
                className="hover:text-primary transition-colors"
              >
                {b}
              </button>
            </React.Fragment>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {entries.map(entry => (
            <div
              key={entry.path}
              className="flex items-center gap-3 px-3 py-2 hover:bg-accent/50 cursor-pointer transition-colors group"
              onClick={() => navigate(entry)}
            >
              {entry.isDirectory ? (
                <Folder size={16} className="text-amber-400 shrink-0" />
              ) : (
                <File size={16} className="text-muted-foreground shrink-0" />
              )}
              <span className="text-sm flex-1 truncate">{entry.name}</span>
              {!entry.isDirectory && (
                <a
                  href={downloadHref(entry.path)}
                  onClick={e => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all"
                >
                  <Download size={14} />
                </a>
              )}
            </div>
          ))}
          {entries.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground text-center">Empty directory</div>
          )}
        </div>
      </div>

      {preview && (
        <div className="flex-1 border border-border rounded-xl bg-card/50 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <span className="text-sm font-medium truncate">{preview.split('/').pop()}</span>
            <div className="flex gap-2">
              <a href={downloadHref(preview)} className="text-muted-foreground hover:text-foreground">
                <Download size={14} />
              </a>
              <button onClick={() => setPreview(null)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <FilePreview path={preview} />
          </div>
        </div>
      )}
    </div>
  )
}
