import type { ImageDocument } from '../../Features/ImageProcessing/Models/ImageDocument'

export interface SessionState {
  originalImage?: ImageDocument
  currentImage?: ImageDocument
  imageHistory: ImageDocument[]
}

type SessionListener = (
  state: SessionState
) => void

export class SessionManager {
  private state: SessionState = {
    imageHistory: [],
  }

  private listeners: Set<SessionListener> =
    new Set()

  public getState(): SessionState {
    return {
      ...this.state,
      imageHistory: [
        ...this.state.imageHistory,
      ],
    }
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
    if (this.state.currentImage) {
      this.state.imageHistory.push(
        this.state.currentImage
      )
    }

    this.state.currentImage = image

    if (!this.state.originalImage) {
      this.state.originalImage = image
    }

    this.notify()
  }

  public undo(): void {
    const previousImage =
      this.state.imageHistory.pop()

    if (!previousImage) {
      return
    }

    this.state.currentImage =
      previousImage

    this.notify()
  }

  public reset(): void {
    if (!this.state.originalImage) {
      return
    }

    this.state.currentImage =
      this.state.originalImage

    this.state.imageHistory = []

    this.notify()
  }

  public clearCurrentImage(): void {
  this.state = {
    imageHistory: [],
  }

  this.notify()
}

  public clearSession(): void {
    this.state = {
      imageHistory: [],
    }

    this.notify()
  }
}

export const sessionManager =
  new SessionManager()