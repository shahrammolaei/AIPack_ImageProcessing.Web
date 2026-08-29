from dataclasses import dataclass


@dataclass
class ImageInfo:
    filename: str
    content_type: str | None
    width: int
    height: int
    channels: int