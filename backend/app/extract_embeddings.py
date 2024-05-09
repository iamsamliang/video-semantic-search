import math
from fastapi import UploadFile
from PIL import Image
import cv2
import tempfile
import os
import torch
import clip

async def extract_frames(video: UploadFile, interval: int) -> list:
    """Extracts 1 frame every `interval` seconds

    Args:
        video (UploadFile): The Video
        interval (int): Seconds between each frame extraction

    Returns:
        list: List of extracted frames
    """
    await video.seek(0)
    
    # Temporarily save to use OpenCV
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmpfile:
        tmpfile.write(await video.read())
        tmpfile_path = tmpfile.name
        
    cap = cv2.VideoCapture(tmpfile_path)
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    capture_rate = interval * fps
    
    frame_counter = 0
    success = True
    frames = []
    
    while success:
        success, frame = cap.read()
        
        if not success:
            break
        
        frame_counter += 1
        
        # If the current frame counter is a multiple of capture rate, add it to the frames list
        if frame_counter % math.floor(capture_rate) == 0:
            frames.append(frame)

    cap.release()
    os.unlink(tmpfile_path)
    await video.close()
    
    return frames

async def extract_video_embeddings(video: UploadFile, model, preprocess, device, interval=1):
    frames = await extract_frames(video=video, interval=interval) # Extract 1 frame per second
    
    frame_embeddings = []
    
    for idx, frame in enumerate(frames):
        with torch.no_grad():
            preprocessed_frame = preprocess(Image.fromarray(frame)).unsqueeze(0).to(device)
            frame_embedding = model.encode_image(preprocessed_frame).squeeze(0)
            
        frame_embeddings.append({
            "id": str((idx + 1) * interval), # also timestamp of video in seconds
            "values": frame_embedding
        })
        
    return frame_embeddings

def embed_text(text: str, model, device):
    with torch.no_grad():
        text_encoded = clip.tokenize([text]).to(device)
        text_embedding = model.encode_text(text_encoded)
    return text_embedding