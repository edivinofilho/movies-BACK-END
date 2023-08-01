import { QueryConfig } from "pg";
import { Movies, MoviesCreate, MoviesResult } from "./interfaces";
import { client } from "./database";
import { Request, Response } from "express";
import format from "pg-format";

const insertQuery = async (req:Request, res: Response): Promise<Response> => {
    const payload: MoviesCreate = req.body; 
    const queryString: string = `
    INSERT INTO movies ("name", "category", "duration", "price")
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: Object.values(payload)
    }

    const queryResult: MoviesResult = await client.query(queryConfig);

    const movie: Movies = queryResult.rows[0]

    return res.status(201).json(movie);
};

const selectQuery = async (req: Request, res: Response): Promise<Response> => {
    const queryString: string = `
    SELECT * FROM movies;
    `
    const queryConfig: QueryConfig = {
        text: queryString
    }

    const queryResult: MoviesResult = await client.query(queryConfig);

    const movies: Movies[] = queryResult.rows;

    return res.status(200).json(movies)
};

const selectByIdQuery = async (req: Request, res: Response): Promise<Response> => {
    const { body, params } = req;

    const tableColumns: string[] = Object.keys(body);
    const tableRows: string[] = Object.values(body);

    const queryTemplate: string =`
    SELECT * FROM movies WHERE id = $1;
    `

    const queryFormat: string = format(
        queryTemplate,
        tableColumns,
        tableRows
    );

    const queryConfig: QueryConfig = {
        text: queryFormat,
        values: [params.id]
    };

    const queryResult: MoviesResult = await client.query(queryConfig);

    const movies: Movies = queryResult.rows[0];

    return res.status(200).json(movies)
};

const updateByIdQuery = async (req: Request, res: Response): Promise<Response> => {
    const { body, params } = req;

    const updateColumns: string[] = Object.keys(body);
    const updateValues: string[] = Object.values(body);

    const queryTemplate: string =`
    UPDATE movies
    SET (%I) = ROW(%L)
    WHERE id = $1
    RETURNING *;
    `;

    const queryFormat: string = format(
        queryTemplate,
        updateColumns,
        updateValues
    );

    const queryConfig: QueryConfig = {
        text: queryFormat,
        values: [params.id],
    };

    const queryResult: MoviesResult = await client.query(queryConfig);
    const updatedMovie = queryResult.rows[0];

    return res.status(200).json(updatedMovie);
};

const deleteByIdQuery = async (req: Request, res: Response): Promise<Response> => {
    const { body, params } = req;

    const tableColumns: string[] = Object.keys(body);
    const tableRows: string[] = Object.values(body);

    const queryTemplate: string = `
    DELETE FROM movies WHERE id = $1;
    `
    const queryFormat: string = format(
        queryTemplate,
        tableColumns,
        tableRows
    );

    const queryConfig: QueryConfig = {
        text: queryFormat,
        values: [params.id]
    };

    const queryResult: MoviesResult = await client.query(queryConfig);
    const deletedMovie: Movies = queryResult.rows[0];

    return res.status(204).send(deletedMovie);
};

export default { insertQuery, selectQuery, selectByIdQuery, deleteByIdQuery, updateByIdQuery };