import { useEffect, useState } from 'react'

import {
  imageProcessingService,
} from '../../Features/ImageProcessing/Services/ImageProcessingService'

import {
  sessionManager,
  type SessionState,
} from '../../Core/Session/SessionManager'

export function ImageProcessingPage() {
  const [sessionState, setSessionState] =
    useState<SessionState>(
      sessionManager.getState()
    )

  useEffect(() => {
    const unsubscribe = sessionManager.subscribe(
      (newState) => {
        setSessionState(newState)
      }
    )

    return unsubscribe
  }, [])

  const handleFileChange = async (
  event: React.ChangeEvent<HTMLInputElement>
  ) => {
  const file = event.target.files?.[0]

  if (!file) {
    return
  }
  
  const imageSource = URL.createObjectURL(file)

  const result = await imageProcessingService.loadImage(
    imageSource,
    file.name
  )

  if (!result.success || !result.image) {
    return
  }

  const processedBlob =
  await imageProcessingService.processImage(file)

const processedSource =
  URL.createObjectURL(processedBlob)

const processedImage = {
  ...result.image,
  source: processedSource,
}
  sessionManager.setCurrentImage(processedImage)
}

  const handleClearImage = () => {
    sessionManager.clearCurrentImage()
  }

  const currentImage =
    sessionState.currentImage

  return (
    <div>
      <h1>Image Processing</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      {currentImage ? (
        <div>
          <p>
  Selected Image: {currentImage.name}
</p>

<p>
  Size: {currentImage.width} × {currentImage.height} px
</p>

          <img
            src={currentImage.source}
            alt={currentImage.name}
            style={{
              maxWidth: '500px',
              maxHeight: '400px',
              display: 'block',
              marginTop: '20px',
            }}
          />

          <button
            onClick={handleClearImage}
            style={{ marginTop: '20px' }}
          >
            Clear Image
          </button>
        </div>
      ) : (
        <p>No image selected</p>
      )}
    </div>
  )
}