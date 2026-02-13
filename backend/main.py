import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from backend.services import analyze_mood, fetch_movies
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="CinéMood API")

# Add CORS middleware to allow the React frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MoodRequest(BaseModel):
    mood: str

class Movie(BaseModel):
    id: int
    title: str
    overview: str
    poster_path: Optional[str]
    vote_average: float
    release_date: Optional[str]

class RecommendationResponse(BaseModel):
    mood: str
    genres: List[int]
    movies: List[Movie]

@app.get("/")
async def root():
    return {"message": "CinéMood Backend API is running"}

@app.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(request: MoodRequest):
    try:
        # 1. Analyze mood using Gemini
        genre_ids = await analyze_mood(request.mood)
        
        # 2. Fetch movies from TMDB
        movies = await fetch_movies(genre_ids)
        
        return {
            "mood": request.mood,
            "genres": genre_ids,
            "movies": movies
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
