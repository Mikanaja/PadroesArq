import boto3
import os
from fastapi import FastAPI
from dotenv import load_dotenv
from controllers.video_controller_s3 import get_router
from transformers import AutoImageProcessor, Dinov2WithRegistersForImageClassification

load_dotenv()

s3_client = boto3.client(
    "s3",
    region_name=os.getenv("AWS_S3_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
)

image_processor = AutoImageProcessor.from_pretrained("WpythonW/dinoV2-deepfake-detector")
model = Dinov2WithRegistersForImageClassification.from_pretrained("WpythonW/dinoV2-deepfake-detector")
model.config.id2label = {0: "FAKE", 1: "REAL"}
model.config.label2id = {"FAKE": 0, "REAL": 1"}

app = FastAPI()

app.include_router(get_router(image_processor, model, s3_client))

@app.get("/")
def home():
    return {"message": "API de Upload de Vídeos está funcionando!"}


# ref no momento: https://huggingface.co/WpythonW/dinoV2-deepfake-detector/tree/main