from dataclasses import dataclass


@dataclass
class VideoInfo:
    filename: str
    content_type: str | None
    width: int
    height: int
    fps: float
    frame_count: int
    duration: float