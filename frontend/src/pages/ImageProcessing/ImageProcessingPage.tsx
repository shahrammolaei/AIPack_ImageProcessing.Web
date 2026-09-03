import { useEffect, useRef, useState } from 'react'
import { ImageWorkspace } from '../../Features/ImageProcessing/Components/ImageWorkspace'
import type {
  ImageAction,
  VideoAction,
} from '../../Features/ImageProcessing/Components/ActionPanel'

import {
  imageProcessingService,
} from '../../Features/ImageProcessing/Services/ImageProcessingService'
import {
  videoProcessingService
} from '../../Features/VideoProcessing/Services/VideoProcessingService'

import type {
  VideoDocument
} from '../../Features/VideoProcessing/Models/VideoDocument'

import {
  sessionManager,
  type SessionState,
} from '../../Core/Session/SessionManager'

import type {
  CapturedMedia,
} from '../../Features/MediaCapture/Types/CapturedMedia'

import {
  mediaDispatcher,
} from '../../Features/MediaCapture/Services/MediaDispatcher'

import { MediaCapture } from '../../Features/MediaCapture/Components/MediaCapture'

export function ImageProcessingPage() {
  const [sessionState, setSessionState] =
    useState<SessionState>(
      sessionManager.getState()
    )

  const fileInputRef =
    useRef<HTMLInputElement>(null)

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  const [currentVideo, setCurrentVideo] =
    useState<VideoDocument | null>(null)

  const [isCaptureOpen, setIsCaptureOpen] =
    useState(false)

  useEffect(() => {
    const unsubscribe =
      sessionManager.subscribe((newState) => {
        setSessionState(newState)
      })

    return unsubscribe
  }, [])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setSelectedFile(file)

    if (file.type.startsWith('video/')) {
      try {
        const video =
          await videoProcessingService.loadVideo(file)

        setCurrentVideo(video)

        sessionManager.clearCurrentImage()

        console.log('Video loaded:', video)

        return
      } catch (error) {
        console.error(
          'Failed to load video:',
          error
        )

        return
      }
    }

    if (file.type.startsWith('image/')) {
      setCurrentVideo(null)

      const imageSource =
        URL.createObjectURL(file)

      const result =
        await imageProcessingService.loadImage(
          imageSource,
          file.name
        )

      if (!result.success || !result.image) {
        return
      }

      sessionManager.setCurrentImage(
        result.image
      )
    }
  }

  const handleCapturedMedia = async (
    media: CapturedMedia
  ) => {

    console.log(
      'Captured media received:',
      media
    )

    setIsCaptureOpen(false)

    if (media.type === 'image') {

      const result =
        await imageProcessingService.loadImage(
          media.source,
          media.name
        )

      if (!result.success || !result.image) {
        return
      }

      setSelectedFile(media.file)

      sessionManager.setCurrentImage(
        result.image
      )

      return
    }

    if (media.type === 'video') {

      try {

        setSelectedFile(media.file)

        const video =
          await videoProcessingService.loadVideo(
            media.file
          )

        setCurrentVideo(video)

        sessionManager.clearCurrentImage()

        return

      } catch (error) {

        console.error(
          'Failed to load captured video:',
          error
        )

        return
      }
    }

    if (media.type === 'audio') {

      console.log(
        'Captured audio:',
        media
      )

      return
    }
  }
  const handleApply = async (
    action: ImageAction | VideoAction,
    strength?: string
  ) => {
    console.log('HANDLE APPLY:', {
      action,
      strength,
      selectedFile,
      currentImage,
    })

    if (action === 'grayscale' && currentVideo) {
      try {
        const processedBlob =
          await videoProcessingService.processVideo(
            selectedFile!
          )

        const processedSource =
          URL.createObjectURL(processedBlob)

        const processedVideo = {
          ...currentVideo,
          source: processedSource,
        }

        setCurrentVideo(processedVideo)

        console.log(
          'Video grayscale applied:',
          processedVideo
        )

        return
      } catch (error) {
        console.error(
          'Failed to process video:',
          error
        )

        return
      }
    }

    if (!selectedFile || !currentImage) {
      return
    }

    if (action === 'improve') {
      const processedBlob =
        await imageProcessingService.enhanceImage(
          selectedFile,
          strength ?? 'medium'
        )

      const processedSource =
        URL.createObjectURL(processedBlob)

      const processedImage = {
        ...currentImage,
        source: processedSource,
      }

      sessionManager.setCurrentImage(
        processedImage
      )
    }


    if (action === 'edit') {
      const processedBlob =
        await imageProcessingService.processImage(
          selectedFile
        )

      const processedSource =
        URL.createObjectURL(processedBlob)

      const processedImage = {
        ...currentImage,
        source: processedSource,
      }

      sessionManager.setCurrentImage(
        processedImage
      )
    }

    if (action === 'blur') {
      const processedBlob =
        await imageProcessingService.blurImage(
          selectedFile,
          strength ?? 'medium'
        )

      const processedSource =
        URL.createObjectURL(processedBlob)

      const processedImage = {
        ...currentImage,
        source: processedSource,
      }

      sessionManager.setCurrentImage(
        processedImage
      )
    }

    if (action === 'edges') {
      const processedBlob =
        await imageProcessingService.detectEdges(
          selectedFile
        )

      const processedSource =
        URL.createObjectURL(
          processedBlob
        )

      const processedImage = {
        ...currentImage,
        source: processedSource,
      }

      sessionManager.setCurrentImage(
        processedImage
      )
    }

  }

  const handleUndo = () => {
    sessionManager.undo()
  }

  const handleReset = () => {
    sessionManager.reset()
  }
  const handleClearImage = () => {
    sessionManager.clearCurrentImage()
  }

  const handleExport = () => {
    if (!currentImage?.source) {
      return
    }
    console.log("source")
    const link = document.createElement('a')

    link.href = currentImage.source

    const originalName =
      currentImage.name || 'image'

    const baseName =
      originalName.replace(/\.[^/.]+$/, '')

    link.download = `${baseName}-processed.png`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const currentImage =
    sessionState.currentImage

  // const [selectedFile, setSelectedFile] =
  //   useState<File | null>(null)

  return (
    <div className="image-processing-page">
      <div className="workspace-heading">
        <div>
          <span className="workspace-eyebrow">
            AIPack
          </span>

          <h1>Image Processing</h1>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        hidden
      />

      {isCaptureOpen && (
        <div
          className="media-capture-overlay"
          onClick={() => {
            setIsCaptureOpen(false)
          }}
        >
          <div
            className="media-capture-modal"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <button
              type="button"
              className="media-capture-modal-close"
              onClick={() => {
                setIsCaptureOpen(false)
              }}
              aria-label="Close"
            >
              ×
            </button>

            <MediaCapture
              onCapture={handleCapturedMedia}
              onClose={() => {
                setIsCaptureOpen(false)
              }}
            />
          </div>
        </div>
      )}

      <ImageWorkspace
        imageSource={
          currentImage?.source ?? null
        }
        originalImageSource={
          sessionState.originalImage?.source ?? null
        }
        imageName={currentImage?.name}
        width={currentImage?.width}
        height={currentImage?.height}


        videoSource={currentVideo?.source ?? null}
        // videoName={currentVideo?.name}
        videoWidth={currentVideo?.width}
        videoHeight={currentVideo?.height}
        videoFps={currentVideo?.fps}
        videoDuration={currentVideo?.duration}
        videoFrameCount={currentVideo?.frameCount}

        onUpload={handleUploadClick}
        onCapture={() => {
          setIsCaptureOpen(true)
        }}
        onClear={handleClearImage}
        onApply={handleApply}
        onUndo={handleUndo}
        onReset={handleReset}
        onExport={handleExport}
      />
    </div>
  )
}