import boto3
import os
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from controllers.video_controller_s3 import get_router
from transformers import ViTForImageClassification, ViTImageProcessor

load_dotenv()

def initialize_s3_client():
    try:
        s3_client = boto3.client(
            "s3",
            region_name=os.getenv("AWS_S3_REGION"),
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        )
        s3_client.list_buckets()  
        return s3_client
    except boto3.exceptions.S3UploadFailedError as e:
        raise HTTPException(status_code=500, detail=f"Falha ao conectar ao S3: {str(e)}")
    except boto3.exceptions.NoCredentialsError:
        raise HTTPException(status_code=500, detail="Credenciais do AWS S3 não encontradas.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro inesperado ao conectar ao S3: {str(e)}")

s3_client = initialize_s3_client()

model = ViTForImageClassification.from_pretrained("prithivMLmods/Deep-Fake-Detector-v2-Model")
image_processor = ViTImageProcessor.from_pretrained("prithivMLmods/Deep-Fake-Detector-v2-Model")

app = FastAPI()

app.include_router(get_router(image_processor, model, s3_client))

@app.get("/")
def home():
    return {"message": "AI Client está funcionando!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
