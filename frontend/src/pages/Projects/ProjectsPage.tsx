import { useEffect, useState } from 'react'

import {
  sessionManager,
  type SessionState,
} from '../../Core/Session/SessionManager'

export function ProjectsPage() {
  const [sessionState, setSessionState] =
    useState<SessionState>(
      sessionManager.getState()
    )

  useEffect(() => {
    const unsubscribe = sessionManager.subscribe(
      (newState) => {
        setSessionState(newState)
      }
    )

    return unsubscribe
  }, [])

  return (
    <div>
      <h1>Projects</h1>

      <p>
        Current Image:{' '}
        {sessionState.currentImage?.name ??
          'No image selected'}
      </p>
    </div>
  )
}