import { useLocation } from 'react-router-dom'
// import {NavigationManagerr} from '../../core/Navigation/NavigationManager'
import { NavigationManager } from '../../Core/Navigation/NavigationManager'

const navigationItems = [
  {
    label: 'Dashboard',
    path: '/',
  },
  {
    label: 'Image Processing',
    path: '/image-processing',
  },
  {
    label: 'Projects',
    path: '/projects',
  },
  {
    label: 'History',
    path: '/history',
  },
  {
    label: 'Settings',
    path: '/settings',
  },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        Workspace
      </div>

      <nav>
        {navigationItems.map((item, index) => (
          <button
            key={item.path}
            className={`sidebar-item ${
              location.pathname === item.path
                ? 'active'
                : ''
            }`}
            onClick={() => NavigationManager.navigate(item.path)}
          >
            <span>{index + 1}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}