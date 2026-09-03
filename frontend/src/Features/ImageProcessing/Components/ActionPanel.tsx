import { useState } from 'react'
import type { ReactNode } from 'react'

export type ImageAction =
  | 'improve'
  | 'edit'
  | 'blur'
  | 'edges'
  | 'remove'
  | 'analyze'

export type VideoAction =
  | 'grayscale'

export type MediaAction =
  | ImageAction
  | VideoAction

interface ActionPanelProps {
  hasImage: boolean
  hasVideo: boolean
  activeAction: MediaAction | null
  onUpload: () => void
  onCapture: () => void
  onClear: () => void
  onActionSelect: (action: MediaAction) => void
}

interface ActionDefinition {
  id: ImageAction
  label: string
  icon: ReactNode
}

interface VideoActionDefinition {
  id: VideoAction
  label: string
  icon: ReactNode
}

const actions: ActionDefinition[] = [
  {
    id: 'improve',
    label: 'Improve',
    icon: '✨',
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: '🎨',
  },
  {
    id: 'blur',
    label: 'Blur',
    icon: '🌫️',
  },
  {
    id: 'edges',
    label: 'Edges',
    icon: '✏️',
  },
  {
    id: 'remove',
    label: 'Remove',
    icon: '🪄',
  },
  {
    id: 'analyze',
    label: 'Analyze',
    icon: '🔍',
  },
]

const videoActions: VideoActionDefinition[] = [
  {
    id: 'grayscale',
    label: 'Grayscale',
    icon: '🎞️',
  },
]

export function ActionPanel({
  hasImage,
  hasVideo,
  activeAction,
  onUpload,
  onCapture,
  onClear,
  onActionSelect,
}: ActionPanelProps) {

  const [isAddMediaOpen, setIsAddMediaOpen] =
    useState(false)

  return (
    <aside className="action-panel">
      <div className="panel-title">
        Actions
      </div>

      <div className="add-media-container">

        <button
          type="button"
          className="upload-action"
          onClick={() =>
            setIsAddMediaOpen(
              (current) => !current
            )
          }
        >
          <span>＋</span>
          Add Media
        </button>

        {isAddMediaOpen && (
          <div className="add-media-options">

            <button
              type="button"
              onClick={() => {
                setIsAddMediaOpen(false)
                onUpload()
              }}
            >
              <span>📁</span>
              Upload Media
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAddMediaOpen(false)
                onCapture()
              }}
            >
              <span>🎥</span>
              Capture Media
            </button>

          </div>
        )}

      </div>
      {hasImage && (
        <div className="action-group">
          <span className="action-group-title">
            AI Tools
          </span>

          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              className={
                activeAction === action.id
                  ? 'action-active'
                  : ''
              }
              onClick={() =>
                onActionSelect(action.id)
              }
            >
              <span>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      )}

      {hasVideo && (
        <div className="action-group">
          <span className="action-group-title">
            Video Tools
          </span>

          {videoActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className={
                activeAction === action.id
                  ? 'action-active'
                  : ''
              }
              onClick={() =>
                onActionSelect(action.id)
              }
            >
              <span>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      )}

      {(hasImage || hasVideo) && (
        <button
          type="button"
          className="clear-action"
          onClick={onClear}
        >
          Clear
        </button>
      )}
    </aside>
  )
}