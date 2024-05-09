from pydantic import BaseModel

class UploadResponse(BaseModel):
    namespace: str
    
class QueryResponse(BaseModel):
    timestamps: list[int] # seconds