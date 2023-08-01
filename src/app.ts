import express, { Application, json } from "express";
import { startDatabase } from "./database";
import logic from "./logic";
import middleware from "./middlewares";

const app: Application = express();
app.use(json());

app.post("/movies", middleware.verifyNameExists, logic.insertQuery);
app.get("/movies", middleware.verifyMovieByCategory, logic.selectQuery);

app.get("/movies/:id", middleware.verifyMovieByIdExists, logic.selectByIdQuery);
app.patch("/movies/:id", middleware.verifyMovieByIdExists, middleware.verifyNameExists, logic.updateByIdQuery);
app.delete("/movies/:id", middleware.verifyMovieByIdExists, logic.deleteByIdQuery);

const PORT: number = 3000;
const runningMsg: string = `Server running on http://localhost:${PORT}`;

app.listen(PORT, async ()=> {
    await startDatabase();
    console.log(runningMsg);
});