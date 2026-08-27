import type { ReactNode } from 'react'

export interface PageDefinition {
  path: string
  label: string
  element: ReactNode
}