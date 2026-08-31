from ..domain.interfaces import ImageProcessor
from ..domain.models import ImageInfo


class ImageService:

    def __init__(self, processor: ImageProcessor):
        self.processor = processor

    def get_image_info(
        self,
        contents: bytes,
        filename: str,
        content_type: str | None,
    ) -> ImageInfo:

        image = self.processor.decode(contents)

        width, height, channels = (
            self.processor.get_info(image)
        )

        return ImageInfo(
            filename=filename,
            content_type=content_type,
            width=width,
            height=height,
            channels=channels,
        )

    def process_grayscale(
        self,
        contents: bytes,
    ) -> bytes:

        image = self.processor.decode(contents)

        processed_image = self.processor.process(image)

        return self.processor.encode_png(processed_image)