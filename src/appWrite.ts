import { Client, ID, Query, TablesDB } from "appwrite";
import type { Movie, TrendingMovie } from "./types/movie";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client()
  .setEndpoint("https://sgp.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const tableDB = new TablesDB(client);

export const updateSearchCount = async (searchTerm: string, movie: Movie) => {
  console.log(searchTerm, movie);
  try {
    const result = await tableDB.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.equal("searchTerm", searchTerm)],
    });

    if (result.rows.length > 0) {
      const row = result.rows[0];
      await tableDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: row.$id,
        data: {
          count: row.count + 1,
        },
      });
    } else {
      await tableDB.createRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        },
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      "Appwrite write failed:",
      error?.message,
      error?.code,
      error?.response,
    );
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    const result = await tableDB.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.limit(5), Query.orderDesc("count")],
    });
    return result.rows as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
