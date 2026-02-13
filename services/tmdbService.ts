
import axios from 'axios';
import { Movie } from '../types';

// Using a placeholder TMDB key if none provided, though usually provided by env
const TMDB_API_KEY = "8309e3966563600f723927d2c0b46761"; // Public read-only test key
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchMoviesByGenres = async (genreIds: number[]): Promise<Movie[]> => {
  try {
    const genreString = genreIds.join(',');
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        with_genres: genreString,
        sort_by: 'popularity.desc',
        'vote_count.gte': 100,
        page: 1
      }
    });

    return response.data.results as Movie[];
  } catch (error) {
    console.error("Error fetching movies from TMDB:", error);
    return [];
  }
};

export const getImageUrl = (path: string, size: string = 'w500') => {
  if (!path) return 'https://picsum.photos/500/750';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
