import { useState } from 'react'

import { WorkspaceToolbar } from './WorkspaceToolbar'
import { ActionPanel, type ImageAction } from './ActionPanel'
import { ImageCanvas } from './ImageCanvas'
import { ActionDetailsPanel } from './ActionDetailsPanel'

import './ImageWorkspace.css'

interface ImageWorkspaceProps {
    imageSource: string | null
    originalImageSource: string | null
    imageName?: string
    width?: number
    height?: number
    onUpload: () => void
    onClear: () => void
    onApply: (
        action: ImageAction,
        strength?: string
    ) => void
    onUndo: () => void
    onReset: () => void
    onExport: () => void
}

export function ImageWorkspace({
    imageSource,
    originalImageSource,
    imageName,
    width,
    height,
    onUpload,
    onClear,
    onApply,
    onUndo,
    onReset,
    onExport,
}: ImageWorkspaceProps) {

    const [activeAction, setActiveAction] =
        useState<ImageAction | null>(null)

    const [isPreviewOpen, setIsPreviewOpen] =
        useState(false)

    return (
        <div className="workspace-shell">

            <div className="image-workspace">

                <ActionPanel
                    onUpload={onUpload}
                    onClear={onClear}
                    hasImage={Boolean(imageSource)}
                    activeAction={activeAction}
                    onActionSelect={(action) => {
                        setActiveAction(action)
                    }}
                />

                <ImageCanvas
                    imageSource={imageSource}
                    imageName={imageName}
                    width={width}
                    height={height}
                />

                <ActionDetailsPanel
                    activeAction={activeAction}
                    imageName={imageName}
                    width={width}
                    height={height}
                    onApply={onApply}
                />

            </div>

            <WorkspaceToolbar
                hasImage={Boolean(imageSource)}
                onClear={onClear}
                onUndo={onUndo}
                onReset={onReset}
                onPreview={() => setIsPreviewOpen(true)}
                onExport={onExport}
            />

            {isPreviewOpen && (
                <div
                    className="preview-overlay"
                    onClick={() => setIsPreviewOpen(false)}
                >
                    <div
                        className="preview-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="preview-header">
                            <h2>Image Preview</h2>

                            <button
                                type="button"
                                className="preview-close"
                                onClick={() =>
                                    setIsPreviewOpen(false)
                                }
                            >
                                ×
                            </button>
                        </div>

                        <div className="preview-comparison">

                            <div className="preview-image-card">
                                <span>Before</span>

                                <img
                                    src={originalImageSource ?? ''}
                                    alt="Original image"
                                />
                            </div>

                            <div className="preview-image-card">
                                <span>After</span>

                                <img
                                    src={imageSource ?? ''}
                                    alt="Processed image"
                                />
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}