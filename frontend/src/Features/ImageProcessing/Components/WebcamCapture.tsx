import { useEffect, useRef, useState } from 'react'

interface WebcamCaptureProps {
  onCapture: (file: File) => void
  onClose: () => void
}

export function WebcamCapture({
  onCapture,
  onClose,
}: WebcamCaptureProps) {
  const videoRef =
    useRef<HTMLVideoElement>(null)

  const streamRef =
    useRef<MediaStream | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const startCamera = async () => {
      try {
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          })

        if (!mounted) {
          stream
            .getTracks()
            .forEach((track) => track.stop())

          return
        }

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error(
          'Failed to access webcam:',
          error
        )

        setError(
          'Unable to access the webcam.'
        )
      }
    }

    startCamera()

    return () => {
      mounted = false

      streamRef.current
        ?.getTracks()
        .forEach((track) => track.stop())
    }
  }, [])

  const handleCapture = () => {
    const video = videoRef.current

    if (!video) {
      return
    }

    const canvas =
      document.createElement('canvas')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context =
      canvas.getContext('2d')

    if (!context) {
      return
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    )

    canvas.toBlob((blob) => {
      if (!blob) {
        return
      }

      const file = new File(
        [blob],
        `webcam-${Date.now()}.jpg`,
        {
          type: 'image/jpeg',
        }
      )

      onCapture(file)
    }, 'image/jpeg')
  }

  return (
    <div className="webcam-capture">
      {error ? (
        <div className="webcam-error">
          {error}
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
        />
      )}

      <div className="webcam-actions">
        <button
          type="button"
          onClick={handleCapture}
          disabled={Boolean(error)}
        >
          📷 Capture
        </button>

        <button
          type="button"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}