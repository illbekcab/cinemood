
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface Recommendation {
  mood: string;
  genres: number[];
  movies: Movie[];
  timestamp: number;
}

export interface UserHistory {
  favorites: Movie[];
  pastSearches: Recommendation[];
}
