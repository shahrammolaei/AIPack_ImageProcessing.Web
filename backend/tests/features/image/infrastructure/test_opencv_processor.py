import cv2
import numpy as np

from app.features.image.infrastructure.opencv_processor import (
    OpenCVImageProcessor,
)


def create_test_image() -> bytes:
    image = np.zeros(
        (100, 200, 3),
        dtype=np.uint8,
    )

    success, encoded = cv2.imencode(
        ".png",
        image,
    )

    assert success

    return encoded.tobytes()


def test_decode():
    processor = OpenCVImageProcessor()

    contents = create_test_image()

    image = processor.decode(contents)

    assert image.shape == (100, 200, 3)


def test_get_info():
    processor = OpenCVImageProcessor()

    contents = create_test_image()
    image = processor.decode(contents)

    width, height, channels = processor.get_info(image)

    assert width == 200
    assert height == 100
    assert channels == 3


def test_process():
    processor = OpenCVImageProcessor()

    contents = create_test_image()
    image = processor.decode(contents)

    processed = processor.process(image)

    assert len(processed.shape) == 2
    assert processed.shape == (100, 200)


def test_encode_png():
    processor = OpenCVImageProcessor()

    contents = create_test_image()
    image = processor.decode(contents)

    processed = processor.process(image)
    encoded = processor.encode_png(processed)

    assert isinstance(encoded, bytes)
    assert encoded.startswith(b"\x89PNG")