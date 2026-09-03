interface ImageCanvasProps {
  imageSource: string | null
  imageName?: string
  width?: number
  height?: number
}

export function ImageCanvas({
  imageSource,
  imageName,
  width,
  height,
}: ImageCanvasProps) {
  return (
    <main className="media-canvas">
      {!imageSource ? (
        <div className="canvas-empty">
          <div className="canvas-icon">＋</div>

          <h2>Start with an image</h2>

          <p>
            Upload an image to begin processing.
          </p>
        </div>
      ) : (
        <div className="image-preview">
          <img
            src={imageSource}
            alt={imageName ?? 'Selected image'}
          />

          <div className="image-meta">
            {width} × {height} px
          </div>
        </div>
      )}
    </main>
  )
}