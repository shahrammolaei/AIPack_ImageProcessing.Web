import { useLocation } from 'react-router-dom'

import { navigationManager } from '../../Core/Navigation/NavigationManager'
import { pageRegistry } from '../../Core/Pages/PageRegistry'

export function Sidebar() {
  const location = useLocation()
  const pages = pageRegistry.getPages()

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        Workspace
      </div>

      <nav>
        {pages.map((page, index) => (
          <button
            key={page.path}
            className={`sidebar-item ${
              location.pathname === page.path
                ? 'active'
                : ''
            }`}
            onClick={() =>
              navigationManager.navigate(page.path)
            }
          >
            <span>{index + 1}</span>
            <span>{page.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}