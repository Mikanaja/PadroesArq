from fastapi import FastAPI
from controllers.video_controller import router as video_router

app = FastAPI()

app.include_router(video_router)

# test route
@app.get("/")
def home():
    return {"message": "API de Upload de Vídeos está funfando!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)