import type {
    CaptureOptions,
} from '../Types/CaptureTypes'

export class MediaCaptureService {

    public async getStream(
        options: CaptureOptions
    ): Promise<MediaStream> {

        console.log('GET STREAM:', options)
        console.log(
            'MEDIA DEVICES:',
            navigator.mediaDevices
        )
        if (options.source === 'camera') {
            return navigator.mediaDevices.getUserMedia({
                video: true,
                audio:
                    options.includeAudio === true,
            })
        }

        if (options.source === 'microphone') {
            return navigator.mediaDevices.getUserMedia({
                video: false,
                audio: true,
            })
        }

        if (options.source === 'screen') {
            const stream =
                await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio:
                        options.includeAudio === true,
                })

            return stream
        }

        throw new Error(
            'Unsupported capture source'
        )
    }

    public stopStream(
        stream: MediaStream
    ): void {

        stream
            .getTracks()
            .forEach((track) => {
                track.stop()
            })
    }

    public async captureImage(
        stream: MediaStream
    ): Promise<File> {

        const videoTrack =
            stream.getVideoTracks()[0]

        if (!videoTrack) {
            throw new Error(
                'No video track available'
            )
        }

        const settings =
            videoTrack.getSettings()

        const width =
            settings.width ?? 1280

        const height =
            settings.height ?? 720

        const video =
            document.createElement('video')

        video.srcObject = stream
        video.muted = true
        video.playsInline = true

        await video.play()

        const canvas =
            document.createElement('canvas')

        canvas.width = width
        canvas.height = height

        const context =
            canvas.getContext('2d')

        if (!context) {
            throw new Error(
                'Unable to create canvas context'
            )
        }

        context.drawImage(
            video,
            0,
            0,
            width,
            height
        )

        const blob =
            await new Promise<Blob | null>(
                (resolve) => {
                    canvas.toBlob(
                        resolve,
                        'image/jpeg',
                        0.95
                    )
                }
            )

        video.srcObject = null

        if (!blob) {
            throw new Error(
                'Failed to capture image'
            )
        }

        return new File(
            [blob],
            `capture-${Date.now()}.jpg`,
            {
                type: 'image/jpeg',
            }
        )
    }

    public createRecorder(
        stream: MediaStream
    ): MediaRecorder {

        const mimeTypes = [
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm',
        ]

        const supportedType =
            mimeTypes.find((type) =>
                MediaRecorder.isTypeSupported(type)
            )

        if (!supportedType) {
            return new MediaRecorder(stream)
        }

        return new MediaRecorder(
            stream,
            {
                mimeType: supportedType,
            }
        )
    }
}

export const mediaCaptureService =
    new MediaCaptureService()