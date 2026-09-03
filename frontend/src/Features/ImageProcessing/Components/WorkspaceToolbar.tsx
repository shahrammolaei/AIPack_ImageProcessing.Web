interface WorkspaceToolbarProps {
  hasImage: boolean
  onClear: () => void
  onUndo: () => void
  onReset: () => void
  onPreview: () => void
 onExport: () => void
}

export function WorkspaceToolbar({
  hasImage,
  onUndo,
  onReset,
  onPreview,
  onExport,
}: WorkspaceToolbarProps) {
  return (
    <div className="workspace-toolbar">

      <div className="toolbar-left">

        <button
          type="button"
          disabled={!hasImage}
          onClick={onUndo}
        >
          ↶ Undo
        </button>

        <button
          type="button"
          disabled={!hasImage}
          onClick={onReset}
        >
          Reset
        </button>

      </div>

      <div className="toolbar-right">

        <button
          type="button"
          disabled={!hasImage}
          onClick={onPreview}
        >
          Preview
        </button>

        <button
          type="button"
          className="export-button"
          disabled={!hasImage}
          onClick={onExport}
        >
          Export
        </button>

      </div>

    </div>
  )
}