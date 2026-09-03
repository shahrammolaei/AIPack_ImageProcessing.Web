import type { ImageDocument } from '../Models/ImageDocument'
import type { ImageProcessingResult } from '../Types/ImageProcessingResult'

export class ImageProcessingService {
  public loadImage(
    source: string,
    name: string
  ): Promise<ImageProcessingResult> {
    return new Promise((resolve) => {
      const imageElement = new Image()

      imageElement.onload = () => {
        const image: ImageDocument = {
          id: crypto.randomUUID(),
          name,
          source,
          width: imageElement.naturalWidth,
          height: imageElement.naturalHeight,
        }

        resolve({
          success: true,
          image,
        })
      }

      imageElement.onerror = () => {
        resolve({
          success: false,
          message: 'Failed to load image',
        })
      }

      imageElement.src = source
    })
  }

  public async processImage(
  file: File
  ): Promise<Blob> {
  const formData = new FormData()

  formData.append('file', file)

  const response = await fetch(
    'http://127.0.0.1:8000/api/image/process',
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error(
      'Image processing failed'
    )
  }

  return await response.blob()
  }

  public async blurImage(
  file: File,
  strength: string
): Promise<Blob> {
  const formData = new FormData()

  formData.append('file', file)

  const response = await fetch(
    `http://127.0.0.1:8000/api/image/blur?strength=${strength}`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error(
      'Image blur failed'
    )
  }

  return await response.blob()
}

  public async enhanceImage(
  file: File,
  strength: string
): Promise<Blob> {
  const formData = new FormData()

  formData.append('file', file)
  console.log(strength)
  const response = await fetch(
    `http://127.0.0.1:8000/api/image/enhance?strength=${strength}`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error(
      'Image enhancement failed'
    )
  }

  return await response.blob()
}

public async detectEdges(
  file: File
): Promise<Blob> {

  const formData = new FormData()

  formData.append(
    'file',
    file
  )

  const response = await fetch(
    'http://127.0.0.1:8000/api/image/edges',
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error(
      'Edge detection failed'
    )
  }

  return await response.blob()
}

}

export const imageProcessingService =
  new ImageProcessingService()