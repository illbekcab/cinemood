# CinéMood: AI-Powered Movie Recommendation Platform

A high-end cinematic experience that analyzes your mood to suggest the perfect films using Google Gemini AI and TMDB.

## 1. Git Workflow
The project follows a modular development workflow with the following branches:
- `main`: Stable production-ready code.
- `feature/frontend-ui`: React components, GSAP animations, and styling.
- `feature/backend-api`: FastAPI backend, Gemini AI, and TMDB integration.

## 2. Environment Variables (.env)
Create a `.env` file in the root directory with:
- `API_KEY`: Your Google Gemini API key.
- `TMDB_API_KEY`: Your The Movie Database API key.
- `PORT`: Backend port (default: 8000).

## 3. Local Setup

### Frontend
1. `npm install`
2. `npm run dev`

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `uvicorn main:app --reload`

## 4. Design Highlights
- **Horizontal Scroll**: Smoothly transitions from vertical exploration to a horizontal cinematic gallery using GSAP ScrollTrigger.
- **Glassmorphism**: Elegant, semi-transparent UI elements that provide a premium "Awwwards" feel.
- **Storytelling UX**: Large typography and serif accents create a narrative flow for the user.
- **AI-Powered**: Uses Gemini to map subjective moods to objective movie genres.
