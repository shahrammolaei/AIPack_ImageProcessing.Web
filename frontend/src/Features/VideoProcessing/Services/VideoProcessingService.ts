import type { VideoDocument } from '../Models/VideoDocument'

export class VideoProcessingService {

    public async processVideo(
        file: File
    ): Promise<Blob> {

        const formData = new FormData()

        formData.append('file', file)

        const response = await fetch(
            'http://127.0.0.1:8000/api/video/process',
            {
                method: 'POST',
                body: formData,
            }
        )

        if (!response.ok) {
            throw new Error(
                'Video processing failed'
            )
        }

        return await response.blob()
    }

    public async loadVideo(
        file: File
    ): Promise<VideoDocument> {

        const source = URL.createObjectURL(file)

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(
            'http://127.0.0.1:8000/api/video/info',
            {
                method: 'POST',
                body: formData,
            }
        )

        if (!response.ok) {
            URL.revokeObjectURL(source)
            throw new Error('Failed to load video')
        }

        const info = await response.json()

        return {
            id: crypto.randomUUID(),
            name: file.name,
            source,
            width: info.width,
            height: info.height,
            fps: info.fps,
            duration: info.duration,
            frameCount: info.frame_count,
        }
    }
}

export const videoProcessingService =
    new VideoProcessingService()