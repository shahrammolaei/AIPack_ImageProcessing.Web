import { Routes, Route } from 'react-router-dom'
import { AppShell } from './app/AppShell'
import { NavigationBootstrap } from './app/NavigationBootstrap'

import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { ImageProcessingPage } from './pages/ImageProcessing/ImageProcessingPage'
import { ProjectsPage } from './pages/Projects/ProjectsPage'
import { HistoryPage } from './pages/History/HistoryPage'
import { SettingsPage } from './pages/Settings/SettingsPage'

export function App() {
  return (
    <>
      <NavigationBootstrap />

      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route
            path="image-processing"
            element={<ImageProcessingPage />}
          />
          <Route
            path="projects"
            element={<ProjectsPage />}
          />
          <Route
            path="history"
            element={<HistoryPage />}
          />
          <Route
            path="settings"
            element={<SettingsPage />}
          />
        </Route>
      </Routes>
    </>
  )
} 