from typing import Union

from fastapi import FastAPI
from pydantic_settings import BaseSettings
from supabase import create_client, Client
from fastapi import File, UploadFile
from PIL import Image
import io
import uuid
from temp import CleanlinessDetector
from datetime import datetime
from pathlib import Path

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

    before_img = Image.open(io.BytesIO(before_image_bytes))
    after_img = Image.open(io.BytesIO(after_image_bytes))

    # DO THE PROCESSING HERE
    cd = CleanlinessDetector()
    # Process images
    before_img = Image.open("cleanliness_detection/samples/1/before.png")
    after_img = Image.open("cleanliness_detection/samples/1/after.png")

    [before_mask, after_mask] = cd.combine_image_mask(before_img, after_img, display=True)

    # Detect objects in the before and after images
    objects_before = cd.detect_objects(before_mask, True)
    objects_after = cd.detect_objects(after_mask, True)

    # Create dictionaries to map object IDs to class names and vice versa
    before_id_to_name = {obj: obj.class_name for obj in objects_before}
    after_id_to_name = {obj: obj.class_name for obj in objects_after}

    before_name_to_id = {obj.class_name: obj for obj in objects_before}
    after_name_to_id = {obj.class_name: obj for obj in objects_after}

    # Calculate the differences
    added, removed, moved = cd.calculate_difference(before_mask, after_mask)

    # Extract class names for printing
    added_names = [obj.class_name for obj in added]
    removed_names = [obj.class_name for obj in removed]
    moved_names = [obj[0][0].class_name for obj in moved]

    # Convert object IDs to class names
    before_names = [before_id_to_name[obj] for obj in objects_before]
    after_names = [after_id_to_name[obj] for obj in objects_after]

    # Calculate the objects_changed list using class names
    objects_changed_names = [x for x in after_names if x not in before_names]

    # Convert the class names back to object IDs using the after_name_to_id dictionary
    objects_changed_ids = [after_name_to_id[name] for name in objects_changed_names]

    # Annotate the before and after images
    before_fig = cd.annotate_image(before_img, objects_before, True)
    after_fig = cd.annotate_image(after_img, objects_after, True)

    # Annotate the changes in the after image using the object IDs
    changes_fig = cd.annotate_changes(after_img, objects_changed_ids, moved, True)

    tasklist = cd.export_results(before_fig, after_fig, changes_fig, added_names, removed_names, moved_names)

    # UPLOAD THE IMAGES TO SUPABASE
    instance_id = uuid.uuid4()
    before_image_path = f"images/{house_id}/before-{instance_id}.{before.content_type.split('/')[1]}"
    after_image_path = f"images/{house_id}/after-{instance_id}.svg"

    changes_image_bytes = save_changes_fig(changes_fig)

    upload_image(before_image_path, before_image_bytes, before.content_type)
    upload_image(after_image_path, changes_image_bytes, 'image/png')

    # INSERT INTO THE DATABASE
    print('Inserting into the cleanliness_logs table of the db')
    logs_response = (
        supabase.table("cleanliness_logs")
        .insert({"id": str(instance_id), "before_image_url": before_image_path, "after_image_url": after_image_path, "house_id": house_id})
        .execute()
    )
    print(logs_response)

    # print('Inserting tasks into the cleanliness_tasks table of the db')
    # for task in tasklist:
    #     tasks_response = (
    #         supabase.table("cleanliness_tasks")
    #         .insert({"cl_log_id": str(instance_id), "name": task})
    #         .execute()
    #     )
    #     print(tasks_response)

    return {
        "house_id": house_id,
        "before_filename": before.filename,
        "after_filename": after.filename,
        "before_image_format": before_img.format,
        "after_image_format": after_img.format
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

def save_changes_fig(fig) -> str:
    img_buffer = io.BytesIO()
    fig.savefig(img_buffer, format='png', dpi=1200, bbox_inches='tight')
    img_buffer.seek(0)
    return img_buffer.getvalue()