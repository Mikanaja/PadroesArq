from fastapi import FastAPI
from controllers.video_controller_s3 import get_router
from transformers import ViTForImageClassification, ViTImageProcessor
from services.s3_service import S3Client

s3_client = S3Client() 

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
