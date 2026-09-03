import type { ReactNode } from 'react'

export type ImageAction =
  | 'improve'
  | 'edit'
  | 'blur'
  | 'edges'
  | 'remove'
  | 'analyze'

interface ActionPanelProps {
  hasImage: boolean
  activeAction: ImageAction | null
  onUpload: () => void
  onClear: () => void
  onActionSelect: (action: ImageAction) => void
}

interface ActionDefinition {
  id: ImageAction
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

export function ActionPanel({
  hasImage,
  activeAction,
  onUpload,
  onClear,
  onActionSelect,
}: ActionPanelProps) {
  return (
    <aside className="action-panel">
      <div className="panel-title">
        Actions
      </div>

      <button
        type="button"
        className="upload-action"
        onClick={onUpload}
      >
        <span>＋</span>
        Add Media
      </button>

      <div className="action-group">
        <span className="action-group-title">
          AI Tools
        </span>

        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            disabled={!hasImage}
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

      {hasImage && (
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