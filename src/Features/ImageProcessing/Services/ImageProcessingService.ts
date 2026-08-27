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
}

export const imageProcessingService =
  new ImageProcessingService()