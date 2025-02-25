import boto3
import os
from fastapi import FastAPI
from dotenv import load_dotenv
from controllers.video_controller_s3 import get_router
from transformers import ViTForImageClassification, ViTImageProcessor

load_dotenv()

s3_client = boto3.client(
    "s3",
    region_name=os.getenv("AWS_S3_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
)

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
