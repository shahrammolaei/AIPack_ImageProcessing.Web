import { useState } from 'react'
import type { ImageAction } from './ActionPanel'

interface ActionDetailsPanelProps {
    activeAction: ImageAction | null
    imageName?: string
    width?: number
    height?: number
    onApply: (
        action: ImageAction,
        strength?: string
    ) => void
}

const actionTitles: Record<ImageAction, string> = {
    improve: 'Improve Image',
    edit: 'Edit Image',
    blur: 'Blur Image',
    edges: 'Edge Detection',
    remove: 'Remove Background',
    analyze: 'Analyze Image',
}

export function ActionDetailsPanel({
    activeAction,
    imageName,
    width,
    height,
    onApply,
}: ActionDetailsPanelProps) {
    const [strength, setStrength] =
        useState('medium')
    if (!activeAction) {
        return (
            <aside className="workspace-details">
                <div className="details-header">
                    <span>Details</span>
                </div>

                <div className="details-content">
                    <div className="detail-item">
                        <span>Name</span>
                        <strong>{imageName}</strong>
                    </div>

                    <div className="detail-item">
                        <span>Size</span>
                        <strong>
                            {width} × {height} px
                        </strong>
                    </div>

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
                <span>{actionTitles[activeAction]}</span>
            </div>

            <div className="action-details-content">

                {activeAction === 'improve' && (
                    <>
                        <p className="action-description">
                            Enhance your image using AI.
                        </p>

                        <label>
                            Enhancement
                        </label>

                        <select value={strength} onChange={(event) => setStrength(event.target.value)}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>

                        <button
                            type="button"
                            className="apply-action-button"
                            onClick={() => {
                                console.log('APPLY BUTTON CLICKED')
                                onApply('improve', strength)
                            }}
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
                                setStrength(event.target.value)
                            }
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>

                        <button
                            type="button"
                            className="apply-action-button"
                            onClick={() => {
                                console.log('BLUR BUTTON CLICKED')
                                onApply('blur', strength)
                            }}
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
                            onClick={() => {
                                console.log('EDGE DETECTION BUTTON CLICKED')
                                onApply('edges')
                            }}
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
                            onClick={() => {
                                console.log('GRAYSCALE BUTTON CLICKED')
                                onApply('edit')
                            }}
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