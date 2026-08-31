from abc import ABC, abstractmethod

import numpy as np


class ImageProcessor(ABC):

    @abstractmethod
    def decode(self, contents: bytes) -> np.ndarray:
        pass

    @abstractmethod
    def get_info(
        self,
        image: np.ndarray,
    ) -> tuple[int, int, int]:
        pass

    @abstractmethod
    def process(
        self,
        image: np.ndarray,
    ) -> np.ndarray:
        pass

    @abstractmethod
    def encode_png(
        self,
        image: np.ndarray,
    ) -> bytes:
        pass