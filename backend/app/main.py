import uuid
from fastapi import FastAPI, UploadFile, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import Any, AsyncGenerator, Annotated
from fastapi.responses import JSONResponse
from pinecone import Pinecone

from app.core.config import settings
from app.extract_embeddings import embed_text, extract_video_embeddings
from app.init_model import init_model
from app.schemas.responses import UploadResponse, QueryResponse

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[Any, Any]:
    app.state.model, app.state.preprocess, app.state.device = init_model()
    print(f"Device: {app.state.device}")
    app.state.pinecone = Pinecone(api_key=settings.PINECONE_API_KEY)
    yield


app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allow_headers=[
            "Origin",
            "Content-Type",
            "Accept",
            "Authorization",
            "X-Requested-With",
        ],
        allow_credentials=True,
    )


@app.post("/video/upload", response_model=UploadResponse)
async def upload_video(video: UploadFile, request: Request) -> JSONResponse:
    namespace_val = video.filename
    if not namespace_val:
        namespace_val = str(uuid.uuid4())
        
    pc: Pinecone = request.app.state.pinecone
    index = pc.Index(settings.PINECONE_INDEX_NAME)
    
    index_namespaces = index.describe_index_stats()["namespaces"]
    
    if namespace_val in index_namespaces:
        return JSONResponse({"namespace": namespace_val})
    
    embeddings = await extract_video_embeddings(video, request.app.state.model, request.app.state.preprocess, request.app.state.device)
    
    index.upsert(
        vectors=embeddings,
        namespace=namespace_val
    )
    
    return JSONResponse({"namespace": namespace_val})
    
@app.post("/video/query", response_model=QueryResponse)
async def query_video(query: Annotated[str, Form()], namespace: str, request: Request) -> JSONResponse:
    pc: Pinecone = request.app.state.pinecone
    index = pc.Index(settings.PINECONE_INDEX_NAME)
    
    query_embedding = embed_text(query, model=request.app.state.model, device=request.app.state.device).squeeze(0)
    
    vector_embed = query_embedding.cpu().detach().numpy().tolist()
    
    matches = index.query(
        namespace=namespace,
        vector=vector_embed,
        top_k=3,
    )["matches"]
    
    return JSONResponse({
        "timestamps": [int(match["id"]) for match in matches]
    })