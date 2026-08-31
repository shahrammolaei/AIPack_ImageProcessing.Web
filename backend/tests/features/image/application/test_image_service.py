import numpy as np

from app.features.image.application.image_service import ImageService
from app.features.image.domain.interfaces import ImageProcessor


class FakeImageProcessor(ImageProcessor):

    def decode(self, contents: bytes) -> np.ndarray:
        return np.zeros((100, 200, 3), dtype=np.uint8)

    def get_info(
        self,
        image: np.ndarray,
    ) -> tuple[int, int, int]:
        return 200, 100, 3

    def process(
        self,
        image: np.ndarray,
    ) -> np.ndarray:
        return np.zeros((100, 200), dtype=np.uint8)

    def encode_png(
        self,
        image: np.ndarray,
    ) -> bytes:
        return b"processed-image"


def test_get_image_info():
    service = ImageService(
        processor=FakeImageProcessor()
    )

    result = service.get_image_info(
        contents=b"fake-image",
        filename="test.png",
        content_type="image/png",
    )

    assert result.filename == "test.png"
    assert result.content_type == "image/png"
    assert result.width == 200
    assert result.height == 100
    assert result.channels == 3


def test_process_grayscale():
    service = ImageService(
        processor=FakeImageProcessor()
    )

    result = service.process_grayscale(
        contents=b"fake-image"
    )

    assert result == b"processed-image"