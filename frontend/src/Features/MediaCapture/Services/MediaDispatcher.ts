import type {
  CapturedMedia,
} from '../Types/CapturedMedia'

export class MediaDispatcher {

  public dispatch(
    media: CapturedMedia
  ): void {

    switch (media.type) {

      case 'image':
        console.log(
          'Dispatching to Image Processing:',
          media
        )
        break

      case 'video':
        console.log(
          'Dispatching to Video Processing:',
          media
        )
        break

      case 'audio':
        console.log(
          'Dispatching to Audio Processing:',
          media
        )
        break

      default:
        console.error(
          'Unsupported media type:',
          media
        )
    }
  }
}

export const mediaDispatcher =
  new MediaDispatcher()