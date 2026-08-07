import os
import uuid

from fastapi import UploadFile
from azure.storage.blob import BlobServiceClient
from dotenv import load_dotenv

load_dotenv()

AZURE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
CONTAINER_NAME = os.getenv("AZURE_CONTAINER_NAME")

blob_service_client = BlobServiceClient.from_connection_string(
    AZURE_CONNECTION_STRING
)


def upload_to_azure(file: UploadFile) -> str:
    """
    Uploads an image to Azure Blob Storage
    and returns the public URL.
    """

    # Generate unique filename
    extension = file.filename.split(".")[-1]
    new_filename = f"{uuid.uuid4()}.{extension}"

    # Blob client
    blob_client = blob_service_client.get_blob_client(
        container=CONTAINER_NAME,
        blob=new_filename
    )

    # Upload file
    blob_client.upload_blob(
        file.file,
        overwrite=True,
        content_type=file.content_type
    )

    # Return URL
    return blob_client.url



def delete_from_azure(image_url: str):
    blob_name = image_url.split("/")[-1]

    blob_client = blob_service_client.get_blob_client(
        container=CONTAINER_NAME,
        blob=blob_name
    )

    blob_client.delete_blob()