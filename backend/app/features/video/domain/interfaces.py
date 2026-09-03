from abc import ABC, abstractmethod

import numpy as np


class VideoProcessor(ABC):

    @abstractmethod
    def get_info(
        self,
        contents: bytes,
    ) -> tuple[int, int, float, int, float]:
        pass

    @abstractmethod
    def read_frame(
            self,
            contents: bytes,
            frame_number: int,
    ) -> np.ndarray:
        pass

    @abstractmethod
    def process(
            self,
            contents: bytes,
    ) -> bytes:
        pass