from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from urllib.parse import unquote
import torch
from PIL import Image
import io
import cv2
import tempfile
import os 

class VideoUrlRequest(BaseModel):
    video_url: str

def get_router(image_processor, model, s3_client):
    router = APIRouter()

    def extract_middle_frame(video_bytes, save_frame_path=None):
        """"""
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp_video_file:
                tmp_video_file.write(video_bytes)
                tmp_video_file.close()

                cap = cv2.VideoCapture(tmp_video_file.name)

                if not cap.isOpened():
                    raise ValueError("Não foi possível abrir o vídeo.")

                frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
                middle_frame_index = frame_count // 2

                cap.set(cv2.CAP_PROP_POS_FRAMES, middle_frame_index)

                ret, frame = cap.read()
                cap.release()

                if not ret:
                    raise ValueError("Não foi possível ler o frame do meio.")

                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

                os.remove(tmp_video_file.name)

                pil_image = Image.fromarray(frame)

                if save_frame_path:
                    pil_image.save(save_frame_path)
                    print(f"Frame salvo em: {save_frame_path}")

                return pil_image
        except Exception as e:
            raise ValueError(f"Erro ao extrair o frame do vídeo: {str(e)}")

    @router.post("/upload/")
    async def upload_video(request: VideoUrlRequest):  
        """Faz todo o rolê"""
        try:
            video_url = request.video_url  
            s3_base_url = f"https://{s3_client.bucket_name}.s3.{s3_client.region_name}.amazonaws.com/"
            
            print(f"nome do bucket: {s3_client.bucket_name}")
            print(f"nome da região: {s3_client.region_name}")

            if not video_url.startswith(s3_base_url):
                raise HTTPException(status_code=400, detail="URL inválida ou não pertence ao bucket configurado.")

            #s3_object_key = "/".join(video_url.split(".com/")[-1].split("/"))
            s3_object_key = unquote(video_url.replace(s3_base_url, "", 1))

            print(s3_object_key)

            video_buffer = s3_client.download_fileobj(s3_client.bucket_name, s3_object_key)

            save_path = "extracted_frame.jpg"  

            middle_frame = extract_middle_frame(video_buffer.read(), save_frame_path=save_path)

            try:
                inputs = image_processor(images=middle_frame, return_tensors="pt")

                with torch.no_grad():
                    outputs = model(**inputs)
                    predicted_class = torch.argmax(outputs.logits, dim=1).item()

                label = model.config.id2label[predicted_class]

            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Erro ao gerar a classificação: {str(e)}")
            
            print(f"Classificação: {label}")

            return label

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao processar o vídeo: {str(e)}")

    return router
