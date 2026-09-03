import { useEffect, useRef, useState } from 'react'

import type {
    CapturedMedia,
} from '../Types/CapturedMedia'

import {
    mediaCaptureService,
} from '../Services/MediaCaptureService'

import type {
    CaptureMode,
} from '../Types/CaptureTypes'

interface MediaCaptureProps {
    onCapture: (media: CapturedMedia) => void
    onClose: () => void
}

export function MediaCapture({
    onCapture,
    onClose,
}: MediaCaptureProps) {

    const videoRef =
        useRef<HTMLVideoElement>(null)

    const streamRef =
        useRef<MediaStream | null>(null)

    const recorderRef =
        useRef<MediaRecorder | null>(null)

    const chunksRef =
        useRef<Blob[]>([])

    const [mode, setMode] =
        useState<CaptureMode>('image')

    const [isRecording, setIsRecording] =
        useState(false)

    const [error, setError] =
        useState<string | null>(null)

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                mediaCaptureService.stopStream(
                    streamRef.current
                )
            }
        }
    }, [])

    const startCapture = async (
        selectedMode: CaptureMode
    ) => {
        console.log('CAPTURE MODE CLICKED:', selectedMode)

        try {
            setError(null)

            if (streamRef.current) {
                mediaCaptureService.stopStream(
                    streamRef.current
                )
            }

            const source =
                selectedMode === 'audio'
                    ? 'microphone'
                    : selectedMode === 'screen'
                        ? 'screen'
                        : 'camera'

            const stream =
                await mediaCaptureService.getStream({
                    mode: selectedMode,
                    source,
                    includeAudio:
                        selectedMode === 'video' ||
                        selectedMode === 'screen',
                })

            streamRef.current = stream

            if (
                videoRef.current &&
                selectedMode !== 'audio'
            ) {
                videoRef.current.srcObject =
                    stream
            }

            setMode(selectedMode)

        } catch (err) {

            console.error(
                'Capture initialization failed:',
                err
            )

            setError(
                'Unable to access the selected media device.'
            )
        }
    }

    const createCapturedMedia = (
        file: File,
        type: 'image' | 'video' | 'audio'
    ): CapturedMedia => {
        return {
            id: crypto.randomUUID(),
            type,
            name: file.name,
            file,
            source: URL.createObjectURL(file),
        }
    }

    const handleImageCapture =
        async () => {

            if (!streamRef.current) {
                return
            }

            try {

                const file =
                    await mediaCaptureService.captureImage(
                        streamRef.current
                    )

                const media =
                    createCapturedMedia(file, 'image')

                onCapture(media)
            } catch (err) {

                console.error(
                    'Image capture failed:',
                    err
                )

                setError(
                    'Failed to capture image.'
                )
            }
        }

    const startRecording = () => {

        if (!streamRef.current) {
            return
        }

        chunksRef.current = []

        const recorder =
            mediaCaptureService.createRecorder(
                streamRef.current
            )

        recorder.ondataavailable = (
            event
        ) => {

            if (event.data.size > 0) {
                chunksRef.current.push(
                    event.data
                )
            }
        }

        recorder.onstop = () => {

            const blob =
                new Blob(
                    chunksRef.current,
                    {
                        type: recorder.mimeType,
                    }
                )

            const extension =
                mode === 'audio'
                    ? 'webm'
                    : 'webm'

            const file =
                new File(
                    [blob],
                    `capture-${Date.now()}.${extension}`,
                    {
                        type: blob.type,
                    }
                )

            const mediaType =
                mode === 'audio'
                    ? 'audio'
                    : 'video'

            const media =
                createCapturedMedia(
                    file,
                    mediaType
                )

            onCapture(media)

            chunksRef.current = []
        }

        recorder.start()

        recorderRef.current = recorder

        setIsRecording(true)
    }

    const stopRecording = () => {

        if (!recorderRef.current) {
            return
        }

        recorderRef.current.stop()

        recorderRef.current = null

        setIsRecording(false)
    }

    return (
        <div className="media-capture">

            <div className="capture-header">

                <h2>
                    Media Capture
                </h2>

                <button
                    type="button"
                    onClick={onClose}
                >

                </button>

            </div>

            <div className="capture-modes">

                <button
                    type="button"
                    className={
                        mode === 'image'
                            ? 'capture-mode-active'
                            : ''
                    }
                    onClick={() =>
                        startCapture('image')
                    }
                >
                    📷 Image
                </button>

                <button
                    type="button"
                    className={
                        mode === 'video'
                            ? 'capture-mode-active'
                            : ''
                    }
                    onClick={() =>
                        startCapture('video')
                    }
                >
                    🎥 Video
                </button>

                <button
                    type="button"
                    className={
                        mode === 'audio'
                            ? 'capture-mode-active'
                            : ''
                    }
                    onClick={() =>
                        startCapture('audio')
                    }
                >
                    🎙️ Audio
                </button>

                <button
                    type="button"
                    className={
                        mode === 'screen'
                            ? 'capture-mode-active'
                            : ''
                    }
                    onClick={() =>
                        startCapture('screen')
                    }
                >
                    🖥️ Screen
                </button>

            </div>

            {error && (
                <div className="capture-error">
                    {error}
                </div>
            )}

            {mode !== 'audio' && (
                <div className="capture-preview">

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                    />

                </div>
            )}

            {mode === 'audio' && (
                <div className="audio-capture-preview">
                    🎙️ Microphone ready
                </div>
            )}

            <div className="capture-controls">

                {mode === 'image' && (
                    <button
                        type="button"
                        onClick={handleImageCapture}
                    >
                        📷 Capture
                    </button>
                )}

                {(mode === 'video' ||
                    mode === 'audio' ||
                    mode === 'screen') && (

                        <button
                            type="button"
                            onClick={
                                isRecording
                                    ? stopRecording
                                    : startRecording
                            }
                        >
                            {isRecording
                                ? '⏹ Stop'
                                : '🔴 Record'}
                        </button>

                    )}

            </div>

        </div>
    )
}