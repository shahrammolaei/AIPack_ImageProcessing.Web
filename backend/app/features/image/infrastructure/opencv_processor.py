import cv2
import numpy as np

from app.features.image.domain.interfaces import ImageProcessor


class OpenCVImageProcessor(ImageProcessor):

    def enhance(
            self,
            image: np.ndarray,
            strength: str,
    ) -> np.ndarray:

        if strength == "low":
            alpha = 1.15
            beta = 5
            sharpness = 0.4

        elif strength == "high":
            alpha = 1.45
            beta = 12
            sharpness = 1.0

        else:
            alpha = 1.30
            beta = 8
            sharpness = 0.7

        enhanced = cv2.convertScaleAbs(
            image,
            alpha=alpha,
            beta=beta,
        )

        blurred = cv2.GaussianBlur(
            enhanced,
            (0, 0),
            3,
        )

        enhanced = cv2.addWeighted(
            enhanced,
            1.0 + sharpness,
            blurred,
            -sharpness,
            0,
        )
        print("dddddddddddddd")
        return enhanced

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

    def blur(
            self,
            image: np.ndarray,
            strength: str,
    ) -> np.ndarray:

        if strength == "low":
            kernel_size = 5

        elif strength == "high":
            kernel_size = 15

        else:
            kernel_size = 9

        return cv2.GaussianBlur(
            image,
            (kernel_size, kernel_size),
            0,
        )

    def detect_edges(
            self,
            image: np.ndarray,
    ) -> np.ndarray:

        gray = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2GRAY,
        )

        edges = cv2.Canny(
            gray,
            100,
            200,
        )

        return edges


    def encode_png(self, image: np.ndarray) -> bytes:
        success, encoded_image = cv2.imencode(
            ".png",
            image,
        )

        if not success:
            raise ValueError("Failed to encode image")

        return encoded_image.tobytes()