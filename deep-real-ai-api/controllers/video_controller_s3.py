from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import cv2
import numpy as np
import torch
from PIL import Image
import requests
from transformers import ViTForImageClassification, ViTImageProcessor
import io

class VideoUrlRequest(BaseModel):
    video_url: str

def get_router(image_processor, model, s3_client):
    router = APIRouter()

    def extract_middle_frame(video_bytes, video_name):
        """Extrai o frame do meio do vídeo e salva a imagem."""
        video_array = np.frombuffer(video_bytes, dtype=np.uint8)
        cap = cv2.VideoCapture()
        cap.open(io.BytesIO(video_array))  # abre diretamente do buffer

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
        image = Image.fromarray(frame)

        save_dir = "../middle_frame"
        os.makedirs(save_dir, exist_ok=True)

        image_path = os.path.join(save_dir, f"{video_name}_middle_frame.jpg")

        try:
            image.save(image_path)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao salvar a imagem: {str(e)}")

        return image

    @router.post("/upload/")
    async def upload_video(request: VideoUrlRequest):  # not a query param
        """Recebe a URL do vídeo, baixa e processa."""
        try:
            video_url = request.video_url  
            response = requests.get(video_url, stream=True)

            print(response)

            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Falha ao baixar o vídeo.")

            video_bytes = response.content
            video_name = video_url.split("/")[-1].split(".")[0]

            middle_frame = extract_middle_frame(video_bytes, video_name)

            try:
                inputs = image_processor(images=middle_frame, return_tensors="pt")

                with torch.no_grad():
                    outputs = model(**inputs)
                    logits = outputs.logits
                    predicted_class = torch.argmax(logits, dim=1).item()

                label = model.config.id2label[predicted_class]

            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Erro ao gerar a classificação: {str(e)}")

            return {"classification": label}

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao processar o vídeo: {str(e)}")

    return router
