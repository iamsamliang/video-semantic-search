from typing import Any, Annotated
from pydantic import (
    AnyUrl,
    BeforeValidator,
)
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv(".env"))


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    PROJECT_NAME: str = "Vid Scour"

    BACKEND_CORS_ORIGINS: Annotated[list[AnyUrl] | str, BeforeValidator(parse_cors)] = (
        []
    )
    
    PINECONE_API_KEY: str
    PINECONE_INDEX_NAME: str

    model_config = SettingsConfigDict(case_sensitive=True)


settings = Settings()  # type: ignore
# (pydantic finds the arguments)
