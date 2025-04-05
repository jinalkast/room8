from typing import Union

from fastapi import FastAPI
from pydantic_settings import BaseSettings
from supabase import create_client, Client
from fastapi import File, UploadFile
from PIL import Image
import io
import uuid
from app.detector import CleanlinessDetector
from datetime import datetime
from pathlib import Path

app = FastAPI()

# Reads from system env in a case insensitive way
class Settings(BaseSettings):
    app_name: str = "Room8 Cleanliness Detection System"
    next_public_supabase_url: str = 'YOUR URL'
    next_secret_supabase_service_role_key: str = 'YOUR KEY'
    port: int = 8000

settings = Settings()
supabase: Client = create_client(settings.next_public_supabase_url, settings.next_secret_supabase_service_role_key)


@app.post("/upload/{camera_id}")
async def upload_images(camera_id: str, before: UploadFile = File(...), after: UploadFile = File(...)):

    # Validate request body
    if (before.content_type != 'image/jpeg' and before.content_type != 'image/png') or (after.content_type != 'image/jpeg' and after.content_type != 'image/png'):
        return { "error": "Invalid image format" }
    
    # Convert the images to bytes
    before_image_bytes = await before.read()
    after_image_bytes = await after.read()

    cd = CleanlinessDetector()

    # Convert the bytes to PIL images
    before_img = Image.open(io.BytesIO(before_image_bytes))
    after_img = Image.open(io.BytesIO(after_image_bytes))

    # Get the original and highlighted versions
    before_orig, after_orig, before_highlighted, after_highlighted = cd.combine_image_mask(before_img, after_img, display=False)

    # Use the original images for detection, but the highlights help us visualize
    # Detect objects in the before and after images
    objects_before = cd.detect_objects(before_highlighted, False)
    objects_after = cd.detect_objects(after_highlighted, False)

    # Calculate the differences using the same original images
    added, removed, moved = cd.calculate_difference(before_orig, after_orig)

    # Annotate the before and after images
    before_fig = cd.annotate_image(before_orig, objects_before, False)
    after_fig = cd.annotate_image(after_orig, objects_after, False)

    # Annotate the changes in the after image
    changes_fig = cd.annotate_changes(after_orig, added, moved, removed, False)

    # Aqcuire the tasklist and the image with the changes highlighted
    tasklist = cd.export_results(before_fig, after_fig, changes_fig, added, removed, moved)
    changes_image_bytes = save_changes_fig(changes_fig)

    # Upload images to supabase storage
    instance_id = uuid.uuid4()
    before_image_path = f"images/{camera_id}/before-{instance_id}.{before.content_type.split('/')[1]}"
    after_image_path = f"images/{camera_id}/after-{instance_id}.png"
    upload_image(before_image_path, before_image_bytes, before.content_type)
    upload_image(after_image_path, changes_image_bytes, 'image/png')

    # Insert the record into supabase
    logs_response = (
        supabase.table("cleanliness_logs")
        .insert({"id": str(instance_id), "before_image_url": before_image_path, "after_image_url": after_image_path, "camera_id": camera_id})
        .execute()
    )

    # insert the tasks into supabase
    # We need to use the same instance id as the cleanliness_logs table
    for task in tasklist:
        tasks_response = (
            supabase.table("cleanliness_tasks")
            .insert({"cl_log_id": str(instance_id), "name": task})
            .execute()
        )

    return {
        "camera_id": camera_id,
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

# Save the changes figure to a byte array
def save_changes_fig(fig) -> str:
    img_buffer = io.BytesIO()
    fig.savefig(img_buffer, format='png', dpi=1200, bbox_inches='tight')
    img_buffer.seek(0)
    return img_buffer.getvalue()