import os

def ensure_upload_dir(upload_dir: str):
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
