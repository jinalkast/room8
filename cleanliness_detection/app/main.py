from typing import Union

from fastapi import FastAPI
from pydantic_settings import BaseSettings
from supabase import create_client, Client
from fastapi import File, UploadFile
from PIL import Image
import io
import uuid

app = FastAPI()

# Reads from system env in a case insensitive way
class Settings(BaseSettings):
    app_name: str = "Room8 Cleanliness Detection System"
    next_public_supabase_url: str 
    next_secret_supabase_service_role_key: str 
    port: int = 8000

settings = Settings()
supabase: Client = create_client(settings.next_public_supabase_url, settings.next_secret_supabase_service_role_key)
@app.get("/")
def hello():
    res = supabase.table('bills').select('*').execute()
    return {"Hello": 'world'}

@app.get("/configCheck")
def hello():
    supabase_works = False
    try:
        res = supabase.table('bills').select('*').execute()
        supabase_works = res.count > 0
    except Exception as e:
        supabase_works = False

    return {"Hello": 'world', 'supabase_works': supabase_works}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.post("/upload/{house_id}")
async def upload_images(house_id: str, before: UploadFile = File(...), after: UploadFile = File(...)):
    if (before.content_type != 'image/jpeg' and before.content_type != 'image/png') or (after.content_type != 'image/jpeg' and after.content_type != 'image/png'):
        return { "error": "Invalid image format" }
    
    before_image_bytes = await before.read()
    after_image_bytes = await after.read()

    before_image = Image.open(io.BytesIO(before_image_bytes))
    after_image = Image.open(io.BytesIO(after_image_bytes))

    # DO THE PROCESSING HERE


    # UPLOAD THE IMAGES TO SUPABASE
    instance_id = uuid.uuid4()
    before_image_path = f"images/{house_id}/before-{instance_id}.{before.content_type.split('/')[1]}"
    after_image_path = f"images/{house_id}/after-{instance_id}.{after.content_type.split('/')[1]}"
    upload_image(before_image_path, before_image_bytes, before.content_type)
    upload_image(after_image_path, after_image_bytes, after.content_type)

    # INSERT INTO THE DATABASE
    print('Inserting into the db')
    response = (
        supabase.table("cleanliness_logs")
        .insert({"id": str(instance_id), "before_image_url": before_image_path, "after_image_url": after_image_path, "house_id": house_id, "algorithm_output": {}})
        .execute()
    )
    print(response)

    return {
        "house_id": house_id,
        "before_filename": before.filename,
        "after_filename": after.filename,
        "before_image_format": before_image.format,
        "after_image_format": after_image.format
    }

# Uploads a given image to supabase storage, returns true/false depending on if it worked
def upload_image(destination_path: str, image_bytes: bytes, content_type: str) -> bool:
    try:
        print(f'Uploading image to {destination_path}')
        response = supabase.storage.from_("cleanliness_images").upload(
            file=image_bytes,
            path=destination_path,
            file_options={"cache-control": "3600", "upsert": "false", "content-type": content_type},
        )
        return True
    except Exception as e:
        print(e)
        return False
    