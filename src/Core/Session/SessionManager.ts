import type { ImageDocument } from '../../Features/ImageProcessing/Models/ImageDocument'

export interface SessionState {
  currentImage?: ImageDocument
}

type SessionListener = (
  state: SessionState
) => void

export class SessionManager {
  private state: SessionState = {}

  private listeners: Set<SessionListener> =
    new Set()

  public getState(): SessionState {
    return { ...this.state }
  }

  public subscribe(
    listener: SessionListener
  ): () => void {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify(): void {
    const currentState = this.getState()

    this.listeners.forEach((listener) => {
      listener(currentState)
    })
  }

  public setCurrentImage(
    image: ImageDocument
  ): void {
    this.state.currentImage = image
    this.notify()
  }

  public clearCurrentImage(): void {
    this.state.currentImage = undefined
    this.notify()
  }

  public clearSession(): void {
    this.state = {}
    this.notify()
  }
}

export const sessionManager = new SessionManager()