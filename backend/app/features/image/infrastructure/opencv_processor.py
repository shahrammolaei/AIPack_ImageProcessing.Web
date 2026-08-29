import cv2
import numpy as np

from app.features.image.domain.interfaces import ImageProcessor


class OpenCVImageProcessor(ImageProcessor):

    def decode(self, contents: bytes) -> np.ndarray:
        image_array = np.frombuffer(
            contents,
            dtype=np.uint8,
        )

        image = cv2.imdecode(
            image_array,
            cv2.IMREAD_COLOR,
        )

        if image is None:
            raise ValueError("Invalid image file")

        return image

    def get_info(self, image: np.ndarray) -> tuple[int, int, int]:
        height, width = image.shape[:2]

        channels = (
            1
            if len(image.shape) == 2
            else image.shape[2]
        )

        return width, height, channels

    def process(self, image: np.ndarray) -> np.ndarray:
        return cv2.cvtColor(
            image,
            cv2.COLOR_BGR2GRAY,
        )

    def grayscale(self, image: np.ndarray) -> np.ndarray:
        return cv2.cvtColor(
            image,
            cv2.COLOR_BGR2GRAY,
        )

    def encode_png(self, image: np.ndarray) -> bytes:
        success, encoded_image = cv2.imencode(
            ".png",
            image,
        )

        if not success:
            raise ValueError("Failed to encode image")

        return encoded_image.tobytes()