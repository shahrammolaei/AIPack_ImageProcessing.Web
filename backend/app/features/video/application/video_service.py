import cv2

from ..domain.interfaces import VideoProcessor
from ..domain.models import VideoInfo


class VideoService:

    def __init__(self, processor: VideoProcessor):
        self.processor = processor

    def get_video_info(
        self,
        contents: bytes,
        filename: str,
        content_type: str | None,
    ) -> VideoInfo:

        (
            width,
            height,
            fps,
            frame_count,
            duration,
        ) = self.processor.get_info(contents)

        return VideoInfo(
            filename=filename,
            content_type=content_type,
            width=width,
            height=height,
            fps=fps,
            frame_count=frame_count,
            duration=duration,
        )

    def get_frame(
            self,
            contents: bytes,
            frame_number: int,
    ) -> bytes:
        frame = self.processor.read_frame(
            contents,
            frame_number,
        )

        success, encoded_frame = cv2.imencode(
            ".jpg",
            frame,
        )

        if not success:
            raise ValueError(
                "Failed to encode video frame"
            )

        return encoded_frame.tobytes()

    def process_grayscale(
            self,
            contents: bytes,
    ) -> bytes:
        return self.processor.process(
            contents
        )