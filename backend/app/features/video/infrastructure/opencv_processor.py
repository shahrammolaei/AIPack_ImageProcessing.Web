import os
import subprocess
import tempfile

import cv2
import imageio_ffmpeg

from app.features.video.domain.interfaces import VideoProcessor


class OpenCVVideoProcessor(VideoProcessor):

    def get_info(
        self,
        contents: bytes,
    ) -> tuple[int, int, float, int, float]:

        temp_path = None

        try:
            with tempfile.NamedTemporaryFile(
                suffix=".mp4",
                delete=False,
            ) as temp_file:

                temp_file.write(contents)
                temp_path = temp_file.name

            capture = cv2.VideoCapture(temp_path)

            if not capture.isOpened():
                raise ValueError("Invalid video file")

            width = int(
                capture.get(cv2.CAP_PROP_FRAME_WIDTH)
            )

            height = int(
                capture.get(cv2.CAP_PROP_FRAME_HEIGHT)
            )

            fps = float(
                capture.get(cv2.CAP_PROP_FPS)
            )

            frame_count = int(
                capture.get(cv2.CAP_PROP_FRAME_COUNT)
            )

            duration = (
                frame_count / fps
                if fps > 0
                else 0.0
            )

            capture.release()

            return (
                width,
                height,
                fps,
                frame_count,
                duration,
            )

        finally:
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)

    def read_frame(
            self,
            contents: bytes,
            frame_number: int,
    ) -> np.ndarray:

        temp_path = None

        try:
            with tempfile.NamedTemporaryFile(
                    suffix=".mp4",
                    delete=False,
            ) as temp_file:

                temp_file.write(contents)
                temp_path = temp_file.name

            capture = cv2.VideoCapture(temp_path)

            if not capture.isOpened():
                raise ValueError("Invalid video file")

            capture.set(
                cv2.CAP_PROP_POS_FRAMES,
                frame_number,
            )

            success, frame = capture.read()

            capture.release()

            if not success:
                raise ValueError(
                    "Failed to read video frame"
                )

            return frame

        finally:
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)

    def process(
            self,
            contents: bytes,
    ) -> bytes:

        input_path = None
        intermediate_path = None
        output_path = None

        try:
            # --------------------------------------------------
            # 1. Save uploaded video to temporary file
            # --------------------------------------------------

            with tempfile.NamedTemporaryFile(
                    suffix=".mp4",
                    delete=False,
            ) as input_file:

                input_file.write(contents)
                input_path = input_file.name

            # --------------------------------------------------
            # 2. Open video with OpenCV
            # --------------------------------------------------

            capture = cv2.VideoCapture(input_path)

            if not capture.isOpened():
                raise ValueError("Invalid video file")

            width = int(
                capture.get(cv2.CAP_PROP_FRAME_WIDTH)
            )

            height = int(
                capture.get(cv2.CAP_PROP_FRAME_HEIGHT)
            )

            fps = float(
                capture.get(cv2.CAP_PROP_FPS)
            )

            if width <= 0 or height <= 0:
                capture.release()

                raise ValueError(
                    "Invalid video dimensions"
                )

            if fps <= 0:
                fps = 30.0

            # --------------------------------------------------
            # 3. Create intermediate video
            #    OpenCV -> mp4v
            # --------------------------------------------------

            with tempfile.NamedTemporaryFile(
                    suffix=".mp4",
                    delete=False,
            ) as intermediate_file:

                intermediate_path = intermediate_file.name

            fourcc = cv2.VideoWriter_fourcc(
                *"mp4v"
            )

            writer = cv2.VideoWriter(
                intermediate_path,
                fourcc,
                fps,
                (width, height),
                True,
            )

            if not writer.isOpened():
                capture.release()

                raise ValueError(
                    "Failed to create intermediate video"
                )

            # --------------------------------------------------
            # 4. Process frames with OpenCV
            # --------------------------------------------------

            while True:

                success, frame = capture.read()

                if not success:
                    break

                gray = cv2.cvtColor(
                    frame,
                    cv2.COLOR_BGR2GRAY,
                )

                gray_bgr = cv2.cvtColor(
                    gray,
                    cv2.COLOR_GRAY2BGR,
                )

                writer.write(gray_bgr)

            capture.release()
            writer.release()

            # --------------------------------------------------
            # 5. Convert intermediate video to H.264
            #    using imageio-ffmpeg
            # --------------------------------------------------

            with tempfile.NamedTemporaryFile(
                    suffix=".mp4",
                    delete=False,
            ) as output_file:

                output_path = output_file.name

            ffmpeg_exe = (
                imageio_ffmpeg.get_ffmpeg_exe()
            )

            command = [
                ffmpeg_exe,
                "-y",
                "-i",
                intermediate_path,
                "-c:v",
                "libx264",
                "-preset",
                "medium",
                "-crf",
                "23",
                "-pix_fmt",
                "yuv420p",
                "-movflags",
                "+faststart",
                output_path,
            ]

            result = subprocess.run(
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=False,
            )

            if result.returncode != 0:
                error_message = (
                    result.stderr.decode(
                        "utf-8",
                        errors="replace",
                    )
                )

                raise ValueError(
                    f"FFmpeg conversion failed: "
                    f"{error_message}"
                )

            # --------------------------------------------------
            # 6. Return browser-compatible MP4
            # --------------------------------------------------

            with open(
                    output_path,
                    "rb",
            ) as output_file:

                return output_file.read()

        finally:

            if input_path and os.path.exists(input_path):
                os.remove(input_path)

            if (
                    intermediate_path
                    and os.path.exists(intermediate_path)
            ):
                os.remove(intermediate_path)

            if (
                    output_path
                    and os.path.exists(output_path)
            ):
                os.remove(output_path)