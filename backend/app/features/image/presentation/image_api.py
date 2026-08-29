from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse, Response

from ..application.image_service import ImageService


router = APIRouter(
    prefix="/api/image",
    tags=["Image Processing"],
)

image_service = ImageService()


@router.post("/info")
async def image_info(file: UploadFile = File(...)):
    contents = await file.read()

    try:
        result = image_service.get_image_info(contents)

        return {
            "filename": file.filename,
            "content_type": file.content_type,
            **result,
        }

    except ValueError as exc:
        return JSONResponse(
            status_code=400,
            content={"error": str(exc)},
        )


@router.post("/process")
async def process_image(file: UploadFile = File(...)):
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