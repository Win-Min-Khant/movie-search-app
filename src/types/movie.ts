export interface Movie {
  id: string;
  title: string;
  vote_average: number;
  poster_path: string;
  release_date: string;
  original_language: string;
}

export interface TrendingMovie {
  $id: string;
  searchTerm: string;
  count: number;
  movie_id: number;
  poster_url: string;
}
