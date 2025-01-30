from typing import Union

from fastapi import FastAPI
from pydantic_settings import BaseSettings
from fastapi import File, UploadFile
from PIL import Image
import io

app = FastAPI()

# Reads from system env in a case insensitive way
class Settings(BaseSettings):
    app_name: str = "Room8 Cleanliness Detection System"
    next_public_supabase_anon_key: str
    next_public_supabase_url: str
    port: int = 8000

settings = Settings()

@app.get("/")
def read_root():
    return {"Hello": settings}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.post("/houses/{house_id}")
async def upload_images(house_id: int, before: UploadFile = File(...), after: UploadFile = File(...)):
    before_image = Image.open(io.BytesIO(await before.read()))
    after_image = Image.open(io.BytesIO(await after.read()))
    return {
        "house_id": house_id,
        "before_filename": before.filename,
        "after_filename": after.filename,
        "before_image_format": before_image.format,
        "after_image_format": after_image.format
    }