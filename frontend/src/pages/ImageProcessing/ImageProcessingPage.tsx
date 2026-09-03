import { useEffect, useRef, useState } from 'react'
import { ImageWorkspace } from '../../Features/ImageProcessing/Components/ImageWorkspace'
import type { ImageAction } from '../../Features/ImageProcessing/Components/ActionPanel'

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

  const fileInputRef =
    useRef<HTMLInputElement>(null)

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

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

    // const processedBlob =
    //   await imageProcessingService.processImage(
    //     file
    //   )

    // const processedSource =
    //   URL.createObjectURL(processedBlob)

    // const processedImage = {
    //   ...result.image,
    //   source: processedSource,
    // }

    // sessionManager.setCurrentImage(
    //   processedImage
    // )

    sessionManager.setCurrentImage(
      result.image
    )
  }

  const handleApply = async (
    action: ImageAction,
    strength?: string
  ) => {
    console.log('HANDLE APPLY:', {
      action,
      strength,
      selectedFile,
      currentImage,
    })
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
        accept="image/*"
        onChange={handleFileChange}
        hidden
      />

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
        onUpload={handleUploadClick}
        onClear={handleClearImage}
        onApply={handleApply}
        onUndo={handleUndo}
        onReset={handleReset}
        onExport={handleExport}
      />
    </div>
  )
}