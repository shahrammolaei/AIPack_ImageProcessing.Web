import { Header } from '../layout/Header/Header'
import { Sidebar } from '../layout/Sidebar/Sidebar'
import { Workspace } from '../layout/Workspace/Workspace'
import { StatusBar } from '../layout/StatusBar/StatusBar'

export function AppShell() {
  return (
    <div className="app-shell">
      <Header />

      <div className="app-body">
        <Sidebar />
        <Workspace />
      </div>

      <StatusBar />
    </div>
  )
}