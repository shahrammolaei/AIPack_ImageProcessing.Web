interface ImageCanvasProps {
  imageSource: string | null
  imageName?: string
  width?: number
  height?: number

  videoSource?: string | null
  // videoName?: string
  videoWidth?: number
  videoHeight?: number
}

export function ImageCanvas({
  imageSource,
  imageName,
  width,
  height,
  videoSource,
  videoWidth,
  videoHeight,
}: ImageCanvasProps) {
  return (
    <main className="media-canvas">
      {!imageSource && !videoSource ? (
        <div className="canvas-empty">
          <div className="canvas-icon">＋</div>

          <h2>Start with media</h2>

          <p>
            Upload an image or video to begin processing.
          </p>
        </div>
      ) : imageSource ? (
        <div className="image-preview">
          <img
            src={imageSource}
            alt={imageName ?? 'Selected image'}
          />

          <div className="image-meta">
            {width} × {height} px
          </div>
        </div>
      ) : (
        <div className="image-preview">
          <video
            src={videoSource ?? ''}
            controls
            playsInline
            onError={(event) => {
              console.error(
                'VIDEO PLAYBACK ERROR:',
                event.currentTarget.error
              )
            }}
          />
          <div className="image-meta">
            {videoWidth} × {videoHeight} px
          </div>
        </div>
      )}
    </main>
  )
}