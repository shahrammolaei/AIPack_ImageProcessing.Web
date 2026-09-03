from fastapi import APIRouter, Depends, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.responses import JSONResponse, Response

from ..application.video_service import VideoService
from ..infrastructure.opencv_processor import OpenCVVideoProcessor


router = APIRouter(
    prefix="/api/video",
    tags=["Video Processing"],
)


def get_video_processor() -> OpenCVVideoProcessor:
    return OpenCVVideoProcessor()


def get_video_service(
    processor: OpenCVVideoProcessor = Depends(
        get_video_processor
    ),
) -> VideoService:

    return VideoService(
        processor=processor,
    )


@router.post("/info")
async def video_info(
    file: UploadFile = File(...),
    video_service: VideoService = Depends(
        get_video_service
    ),
):

    contents = await file.read()

    try:
        result = video_service.get_video_info(
            contents=contents,
            filename=file.filename or "",
            content_type=file.content_type,
        )

        return {
            "filename": result.filename,
            "content_type": result.content_type,
            "width": result.width,
            "height": result.height,
            "fps": result.fps,
            "frame_count": result.frame_count,
            "duration": result.duration,
        }

    except ValueError as exc:
        return JSONResponse(
            status_code=400,
            content={"error": str(exc)},
        )

@router.post("/frame")
async def video_frame(
    file: UploadFile = File(...),
    frame_number: int = 0,
    video_service: VideoService = Depends(
        get_video_service
    ),
):

    contents = await file.read()

    try:
        frame = video_service.get_frame(
            contents=contents,
            frame_number=frame_number,
        )

        return Response(
            content=frame,
            media_type="image/jpeg",
        )

    except ValueError as exc:
        return JSONResponse(
            status_code=400,
            content={"error": str(exc)},
        )

@router.post("/process")
async def process_video(
    file: UploadFile = File(...),
    video_service: VideoService = Depends(
        get_video_service
    ),
):

    contents = await file.read()

    try:
        processed_video = (
            video_service.process_grayscale(
                contents
            )
        )

        return Response(
            content=processed_video,
            media_type="video/mp4",
        )

    except ValueError as exc:
        return JSONResponse(
            status_code=400,
            content={"error": str(exc)},
        )