from ..domain.interfaces import ImageProcessor


class ImageService:

    def __init__(self, processor: ImageProcessor):
        self.processor = processor

    def get_image_info(
        self,
        contents: bytes,
    ) -> dict:
        image = self.processor.decode(contents)

        width, height, channels = (
            self.processor.get_info(image)
        )

        return {
            "width": width,
            "height": height,
            "channels": channels,
        }

    def process_grayscale(
        self,
        contents: bytes,
    ) -> bytes:
        image = self.processor.decode(contents)

        gray_image = self.processor.process(image)

        return self.processor.encode_png(gray_image)