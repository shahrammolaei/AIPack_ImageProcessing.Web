import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { navigationManager } from '../Core/Navigation/NavigationManager'

export function NavigationBootstrap() {
  const navigate = useNavigate()

  useEffect(() => {
    navigationManager.setNavigate(navigate)
  }, [navigate])

  return null
}