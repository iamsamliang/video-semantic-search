# video-semantic-search

A minimal fullstack app that lets you upload a video and perform visual semantic search on it. Frontend is built with Next.js and Backend is built with FastAPI

# Backend (FastAPI)

- `cd` into `backend` directory
- Run `poetry install` to install dependencies. You need to install `poetry` first, a package manager.
  - If you're on windows and have a GPU, you need to install PyTorch on your own separately
- To start backend, execute `uvicorn app.main:app`

File Upload Pipeline: takes in an uploaded file, extracts 1 frame every second using OpenCV, create image embeddings using CLIP, store embeddings in Pinecone vector database

Query Pipeline: embed query using CLIP, return timestamps from Pinecone corresponding to top image embeddings with highest cosine similarity to the query.

Potential iterations:
1. Doesn't capture temporal information from the video because each frame is consider in isolation. Could try chunking the video and getting one embedding per chunk in which we get M frames per chunk and concatenate/sum the embeddings of the M frames together to get the chunk embedding. A better way would be to learn a linear mapping into another embedding space instead of just concatenating/summing.
2. Capture text transcription as well and combine with visual aspect to perform a more comprehensive semantic search on video

# Frontend (Next.js)
- `cd` into `frontend` directory
- Run `pnpm install` to install dependencies.
- To start frontend, execute `pnpm run dev`
