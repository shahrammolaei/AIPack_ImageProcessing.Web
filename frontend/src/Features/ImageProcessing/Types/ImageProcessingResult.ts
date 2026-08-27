import type { ImageDocument } from '../Models/ImageDocument'

export interface ImageProcessingResult {
  success: boolean
  image?: ImageDocument
  message?: string
}