import { useEffect, useState } from 'react'

import { WorkspaceToolbar } from './WorkspaceToolbar'
import {
    ActionPanel,
    type ImageAction,
    type VideoAction,
    type MediaAction,
} from './ActionPanel'
import { ImageCanvas } from './ImageCanvas'
import { ActionDetailsPanel } from './ActionDetailsPanel'

import './ImageWorkspace.css'

interface ImageWorkspaceProps {
    imageSource: string | null
    originalImageSource: string | null
    imageName?: string
    width?: number
    height?: number
    // video Features
    videoSource?: string | null
    // videoName?: string
    videoWidth?: number
    videoHeight?: number
    videoFps?: number
    videoDuration?: number
    videoFrameCount?: number
    //----------------

    onUpload: () => void
    onCapture: () => void
    onClear: () => void
    onApply: (
        action: ImageAction | VideoAction,
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
    // video Features
    videoSource,
    // videoName,
    videoWidth,
    videoHeight,
    videoFps,
    videoDuration,
    videoFrameCount,
    //----------------

    onUpload,
    onCapture,
    onClear,
    onApply,
    onUndo,
    onReset,
    onExport,
}: ImageWorkspaceProps) {

    const [activeAction, setActiveAction] =
        useState<MediaAction | null>(null)

    const [isPreviewOpen, setIsPreviewOpen] =
        useState(false)

    useEffect(() => {
        setActiveAction(null)
    }, [imageSource, videoSource])

    return (
        <div className="workspace-shell">

            <div className="image-workspace">

                <ActionPanel
                    onUpload={onUpload}
                    onCapture={onCapture}
                    onClear={onClear}
                    hasImage={Boolean(imageSource)}
                    hasVideo={Boolean(videoSource)}
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
                    videoSource={videoSource}
                    // videoName={videoName}
                    videoWidth={videoWidth}
                    videoHeight={videoHeight}
                />

                <ActionDetailsPanel
                    activeAction={activeAction}
                    imageName={imageName}
                    width={width}
                    height={height}
                    // videoName={videoName}
                    videoWidth={videoWidth}
                    videoHeight={videoHeight}
                    videoFps={videoFps}
                    videoDuration={videoDuration}
                    videoFrameCount={videoFrameCount}
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