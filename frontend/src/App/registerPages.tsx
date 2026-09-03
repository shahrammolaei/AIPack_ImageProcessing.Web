import { PageRegistrar } from '../Core/Pages/PageRegistrar'

import { DashboardPage } from '../pages/Dashboard/DashboardPage'
import { ImageProcessingPage } from '../pages/ImageProcessing/ImageProcessingPage'
import { ProjectsPage } from '../pages/Projects/ProjectsPage'
import { HistoryPage } from '../pages/History/HistoryPage'
import { SettingsPage } from '../pages/Settings/SettingsPage'

PageRegistrar.register({
  path: '/image-processing',
  label: 'Dashboard',
  element: <DashboardPage />,
})

PageRegistrar.register({
  path: '/',
  label: 'Image Processing',
  element: <ImageProcessingPage />,
})

PageRegistrar.register({
  path: '/projects',
  label: 'Projects',
  element: <ProjectsPage />,
})

PageRegistrar.register({
  path: '/history',
  label: 'History',
  element: <HistoryPage />,
})

PageRegistrar.register({
  path: '/settings',
  label: 'Settings',
  element: <SettingsPage />,
})