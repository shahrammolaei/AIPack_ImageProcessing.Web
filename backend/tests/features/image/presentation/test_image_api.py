import cv2
import numpy as np

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


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


def test_image_info():
    image_bytes = create_test_image()

    response = client.post(
        "/api/image/info",
        files={
            "file": (
                "test.png",
                image_bytes,
                "image/png",
            )
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["filename"] == "test.png"
    assert data["content_type"] == "image/png"
    assert data["width"] == 200
    assert data["height"] == 100
    assert data["channels"] == 3


def test_image_process():
    image_bytes = create_test_image()

    response = client.post(
        "/api/image/process",
        files={
            "file": (
                "test.png",
                image_bytes,
                "image/png",
            )
        },
    )

    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"

    processed_image = cv2.imdecode(
        np.frombuffer(
            response.content,
            dtype=np.uint8,
        ),
        cv2.IMREAD_UNCHANGED,
    )

    assert processed_image is not None
    assert processed_image.shape == (100, 200)