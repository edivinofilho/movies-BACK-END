import { QueryResult } from "pg";

interface Movies {
    id: number,
    name: string,
    category: string,
    duration: number,
    price: number
};

type MoviesCreate = Omit<Movies, "id">;
type MoviesResult = QueryResult<Movies>;

export { Movies, MoviesCreate, MoviesResult };