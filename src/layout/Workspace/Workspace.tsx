import { Outlet } from 'react-router-dom'

export function Workspace() {
  return (
    <main className="workspace">
      <Outlet />
    </main>
  )
}