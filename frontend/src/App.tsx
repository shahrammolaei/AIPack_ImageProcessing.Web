import './App/registerPages'

import { Routes, Route } from 'react-router-dom'

import { AppShell } from './App/AppShell'
import { NavigationBootstrap } from './App/NavigationBootstrap'
import { pageRegistry } from './Core/Pages/PageRegistry'

export function App() {
  const pages = pageRegistry.getPages()

  return (
    <>
      <NavigationBootstrap />

      <Routes>
        <Route path="/" element={<AppShell />}>
          {pages.map((page) => {
            if (page.path === '/') {
              return (
                <Route
                  key={page.path}
                  index
                  element={page.element}
                />
              )
            }

            return (
              <Route
                key={page.path}
                path={page.path.substring(1)}
                element={page.element}
              />
            )
          })}
        </Route>
      </Routes>
    </>
  )
}