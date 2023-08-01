import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { Movies, MoviesResult } from "./interfaces";
import { client } from "./database";

const verifyNameExists = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { name } = req.body;

    const queryTemplate: string = `
    SELECT * FROM movies WHERE name = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryTemplate,
        values: [name],
    };

    const queryResult: MoviesResult = await client.query(queryConfig);

    const foundMovie: Movies = queryResult.rows[0];

    if(foundMovie){
        const message: string = `Movie name already exists!`;
        return res.status(409).json({message});
    };
    
    return next();
};

const verifyMovieByIdExists = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;

    const queryTemplate: string = `
    SELECT * FROM movies WHERE id = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryTemplate,
        values: [id],
    };

    const queryResult: MoviesResult = await client.query(queryConfig);

    const foundMovieById: Movies = queryResult.rows[0];

    if(!foundMovieById){
        const message: string = `Movie not found!`;
        return res.status(404).json({message});
    };
    
    return next();
};

const verifyMovieByCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { category } = req.query;

    const queryTemplate: string = `
    SELECT * FROM movies WHERE category = $1;
    `
    const queryConfig: QueryConfig = {
        text: queryTemplate,
        values: [ category ]
    };

    const queryResult: MoviesResult = await client.query(queryConfig);

    const moviesByCategory: Movies[] = queryResult.rows;

    if(moviesByCategory.length !== 0) {
        return res.status(200).json(moviesByCategory);
    } 

    return next();
};

export default { verifyNameExists, verifyMovieByIdExists,verifyMovieByCategory };