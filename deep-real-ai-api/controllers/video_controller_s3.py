from fastapi import APIRouter, HTTPException
import ffmpeg
import cv2
import numpy as np
import torch
from PIL import Image
import requests
from transformers import ViTForImageClassification, ViTImageProcessor
from models.video_model import VideoModel
import io

def get_router(image_processor, model, s3_client):
    router = APIRouter()

    def extract_middle_frame(video_bytes):
        """Extrai o frame do meio do vídeo (agora diretamente do buffer)."""
        video_stream = io.BytesIO(video_bytes)

        # salva o vídeo temporariamente no buffer
        with open("/tmp/temp_video.mp4", "wb") as temp_file:
            temp_file.write(video_stream.read())

        cap = cv2.VideoCapture("/tmp/temp_video.mp4")
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        if frame_count == 0:
            raise ValueError("Não foi possível extrair frames do vídeo.")

        middle_frame_index = frame_count // 2
        cap.set(cv2.CAP_PROP_POS_FRAMES, middle_frame_index)

        ret, frame = cap.read()
        cap.release()

        if not ret:
            raise ValueError("Não foi possível ler o frame do meio.")

        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        return Image.fromarray(frame)

    @router.post("/upload/")
    async def upload_video(video_url: str):
        """Recebe a URL do vídeo, baixa e processa."""
        try:
            response = requests.get(video_url, stream=True)

            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Falha ao baixar o vídeo.")

            video_bytes = response.content

            probe = ffmpeg.probe(
                io.BytesIO(video_bytes),
                v="error",
                select_streams="v:0",
                show_entries="stream=duration",
            )
            duration = float(probe["streams"][0]["duration"])

            middle_frame = extract_middle_frame(video_bytes)

            inputs = image_processor(images=middle_frame, return_tensors="pt")

            with torch.no_grad():
                outputs = model(**inputs)
                logits = outputs.logits
                predicted_class = torch.argmax(logits, dim=1).item()

            label = model.config.id2label[predicted_class]

            video_data = VideoModel(
                filename=video_url.split("/")[-1], 
                content_type="video/mp4",
                size=len(video_bytes),
                duration=int(duration),
                format_type="mp4",
            )

            return {
                "message": "Upload processado com sucesso!",
                "video_info": video_data,
                "classification": label,
            }

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao processar o vídeo: {str(e)}")

    return router
