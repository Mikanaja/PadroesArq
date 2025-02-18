from fastapi import APIRouter, File, UploadFile, HTTPException
import ffmpeg
import io
from models.video_model import VideoModel

router = APIRouter()

@router.post("/upload/")
async def upload_video(file: UploadFile = File(...)):
    MAX_SIZE_MB = 500  # 500MB
    MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

    if file.size and file.size > MAX_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="O arquivo é muito grande! Máximo permitido: 500MB.")

    content_type = file.content_type

    if not content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="O arquivo deve ser um vídeo!")

    file_content = await file.read()

    try:
        video_stream = io.BytesIO(file_content)
        
        probe = ffmpeg.probe(video_stream, v='error', select_streams='v:0', show_entries='stream=duration')
        duration = float(probe['streams'][0]['duration'])
    except ffmpeg.Error as e:
        raise HTTPException(status_code=400, detail="Não foi possível processar o vídeo com FFmpeg.")
    
    video_data = VideoModel(
        filename=file.filename,
        content_type=content_type,
        size=file.size,
        duration=duration
    )

    return {"message": "Upload realizado com sucesso!", "video_info": video_data}
