import { useState } from 'react'
import type {
    ImageAction,
    VideoAction,
    MediaAction,
} from './ActionPanel'

interface ActionDetailsPanelProps {
    activeAction: MediaAction | null

    imageName?: string
    width?: number
    height?: number

    videoName?: string
    videoWidth?: number
    videoHeight?: number
    videoFps?: number
    videoDuration?: number
    videoFrameCount?: number

    onApply: (
        action: ImageAction | VideoAction,
        strength?: string
    ) => void
}

const actionTitles: Record<
    MediaAction,
    string
> = {
    improve: 'Improve Image',
    edit: 'Edit Image',
    blur: 'Blur Image',
    edges: 'Edge Detection',
    remove: 'Remove Background',
    analyze: 'Analyze Image',
    grayscale: 'Grayscale Video',
}

export function ActionDetailsPanel({
    activeAction,
    imageName,
    width,
    height,

    videoName,
    videoWidth,
    videoHeight,
    videoFps,
    videoDuration,
    videoFrameCount,

    onApply,
}: ActionDetailsPanelProps) {
    const [strength, setStrength] =
        useState('medium')

    const hasVideo = Boolean(videoName)

    if (!activeAction) {
        return (
            <aside className="workspace-details">

                <div className="details-header">
                    <span>Details</span>
                </div>

                <div className="details-content">

                    <div className="detail-item">
                        <span>Name</span>

                        <strong>
                            {hasVideo
                                ? videoName
                                : imageName}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>Size</span>

                        <strong>
                            {hasVideo
                                ? `${videoWidth} × ${videoHeight} px`
                                : `${width} × ${height} px`}
                        </strong>
                    </div>

                    {hasVideo && (
                        <>
                            <div className="detail-item">
                                <span>FPS</span>

                                <strong>
                                    {videoFps}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Duration</span>

                                <strong>
                                    {videoDuration?.toFixed(2)} s
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Frames</span>

                                <strong>
                                    {videoFrameCount}
                                </strong>
                            </div>
                        </>
                    )}

                    <div className="detail-item">
                        <span>Status</span>

                        <strong className="status-ready">
                            Ready
                        </strong>
                    </div>

                </div>
            </aside>
        )
    }

    return (
        <aside className="workspace-details">

            <div className="details-header">
                <span>
                    {actionTitles[activeAction]}
                </span>
            </div>

            <div className="action-details-content">

                {activeAction === 'grayscale' && (
                    <>
                        <p className="action-description">
                            Convert the video to grayscale.
                        </p>

                        <button
                            type="button"
                            className="apply-action-button"
                            onClick={() => {
                                console.log(
                                    'VIDEO GRAYSCALE BUTTON CLICKED'
                                )

                                onApply('grayscale')
                            }}
                        >
                            Apply Grayscale
                        </button>
                    </>
                )}

                {activeAction === 'improve' && (
                    <>
                        <p className="action-description">
                            Enhance your image using AI.
                        </p>

                        <label>
                            Enhancement
                        </label>

                        <select
                            value={strength}
                            onChange={(event) =>
                                setStrength(
                                    event.target.value
                                )
                            }
                        >
                            <option value="low">
                                Low
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="high">
                                High
                            </option>
                        </select>

                        <button
                            type="button"
                            className="apply-action-button"
                            onClick={() =>
                                onApply(
                                    'improve',
                                    strength
                                )
                            }
                        >
                            Apply
                        </button>
                    </>
                )}

                {activeAction === 'blur' && (
                    <>
                        <p className="action-description">
                            Blur the image using Gaussian Blur.
                        </p>

                        <label>
                            Blur Strength
                        </label>

                        <select
                            value={strength}
                            onChange={(event) =>
                                setStrength(
                                    event.target.value
                                )
                            }
                        >
                            <option value="low">
                                Low
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="high">
                                High
                            </option>
                        </select>

                        <button
                            type="button"
                            className="apply-action-button"
                            onClick={() =>
                                onApply(
                                    'blur',
                                    strength
                                )
                            }
                        >
                            Apply Blur
                        </button>
                    </>
                )}

                {activeAction === 'edges' && (
                    <>
                        <p className="action-description">
                            Detect edges and contours in the image.
                        </p>

                        <button
                            type="button"
                            className="apply-action-button"
                            onClick={() =>
                                onApply('edges')
                            }
                        >
                            Detect Edges
                        </button>
                    </>
                )}

                {activeAction === 'edit' && (
                    <>
                        <p className="action-description">
                            Apply AI-powered image editing.
                        </p>

                        <button
                            type="button"
                            className="apply-action-button"
                            onClick={() =>
                                onApply('edit')
                            }
                        >
                            Grayscale
                        </button>
                    </>
                )}

                {activeAction === 'remove' && (
                    <>
                        <p className="action-description">
                            Remove the image background using AI.
                        </p>

                        <button
                            type="button"
                            className="apply-action-button"
                        >
                            Remove Background
                        </button>
                    </>
                )}

                {activeAction === 'analyze' && (
                    <>
                        <p className="action-description">
                            Analyze the image using AI.
                        </p>

                        <button
                            type="button"
                            className="apply-action-button"
                        >
                            Apply
                        </button>
                    </>
                )}

            </div>
        </aside>
    )
}