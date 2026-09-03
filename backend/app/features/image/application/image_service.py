from ..domain.interfaces import ImageProcessor
from ..domain.models import ImageInfo


class ImageService:

    def __init__(self, processor: ImageProcessor):
        self.processor = processor

    def enhance_image(
            self,
            contents: bytes,
            strength: str,
    ) -> bytes:
        image = self.processor.decode(contents)
        print("test enhance")
        enhanced_image = self.processor.enhance(
            image,
            strength,
        )

        return self.processor.encode_png(
            enhanced_image
        )


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

    def blur(
            self,
            contents: bytes,
            strength: str,
    ) -> bytes:
        image = self.processor.decode(contents)

        blurred_image = self.processor.blur(
            image,
            strength,
        )

        return self.processor.encode_png(
            blurred_image
        )

    def detect_edges(
            self,
            contents: bytes,
    ) -> bytes:
        image = self.processor.decode(contents)

        edges = self.processor.detect_edges(
            image
        )

        return self.processor.encode_png(
            edges
        )