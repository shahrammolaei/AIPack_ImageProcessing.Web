from fastapi import APIRouter, Depends, File, UploadFile
from fastapi.responses import JSONResponse, Response

from ..application.image_service import ImageService
from ..infrastructure.opencv_processor import OpenCVImageProcessor


router = APIRouter(
    prefix="/api/image",
    tags=["Image Processing"],
)


def get_image_processor() -> OpenCVImageProcessor:
    return OpenCVImageProcessor()


def get_image_service(
    processor: OpenCVImageProcessor = Depends(
        get_image_processor
    ),
) -> ImageService:
    return ImageService(
        processor=processor,
    )


@router.post("/info")
async def image_info(
    file: UploadFile = File(...),
    image_service: ImageService = Depends(get_image_service),
):
    contents = await file.read()

    try:
        result = image_service.get_image_info(
            contents=contents,
            filename=file.filename or "",
            content_type=file.content_type,
        )

        return {
            "filename": result.filename,
            "content_type": result.content_type,
            "width": result.width,
            "height": result.height,
            "channels": result.channels,
        }

    except ValueError as exc:
        return JSONResponse(
            status_code=400,
            content={"error": str(exc)},
        )


@router.post("/process")
async def process_image(
    file: UploadFile = File(...),
    image_service: ImageService = Depends(get_image_service),
):
    contents = await file.read()

    try:
        processed_image = image_service.process_grayscale(
            contents
        )

        return Response(
            content=processed_image,
            media_type="image/png",
        )

    except ValueError as exc:
        return JSONResponse(
            status_code=400,
            content={"error": str(exc)},
        )

@router.post("/blur")
async def blur_image(
    file: UploadFile = File(...),
    strength: str = "medium",
    image_service: ImageService = Depends(get_image_service),
):
    contents = await file.read()

    try:
        processed_image = image_service.blur(
            contents=contents,
            strength=strength,
        )

        return Response(
            content=processed_image,
            media_type="image/png",
        )

    except ValueError as exc:
        return JSONResponse(
            status_code=400,
            content={"error": str(exc)},
        )


@router.post("/enhance")
async def enhance_image(
    file: UploadFile = File(...),
    strength: str = "medium",
    image_service: ImageService = Depends(
        get_image_service
    ),
):
    contents = await file.read()
    print(strength)
    try:
        processed_image = image_service.enhance_image(
            contents=contents,
            strength=strength,
        )

        return Response(
            content=processed_image,
            media_type="image/png",
        )

    except ValueError as exc:
        return JSONResponse(
            status_code=400,
            content={"error": str(exc)},
        )

@router.post("/edges")
async def detect_edges(
    file: UploadFile = File(...),
    image_service: ImageService = Depends(
        get_image_service
    ),
):
    contents = await file.read()

    try:
        processed_image = image_service.detect_edges(
            contents=contents,
        )

        return Response(
            content=processed_image,
            media_type="image/png",
        )

    except ValueError as exc:
        return JSONResponse(
            status_code=400,
            content={"error": str(exc)},
        )