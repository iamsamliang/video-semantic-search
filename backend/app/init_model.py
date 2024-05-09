import torch
import clip

def init_model():
    if torch.cuda.is_available():
        device = "cude" # NVIDIA GPU
    elif torch.backends.mps.is_available():
        device = "mps" # Apple GPU
    else:
        device = "cpu" # Use CPU as a fallback
        
    model, preprocess = clip.load("ViT-B/32", device=device)

    return model, preprocess, device