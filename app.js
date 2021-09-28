const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "moviesData.db");

const app = express();
app.use(express.json());

let db = null;

const initializeServer = async (request, response) => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("The Server listening to port 3000");
    });
  } catch (error) {
    console.log(`Database error: ${error}`);
    process.exit(1);
  }
};

initializeServer();

app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
       SELECT movie_name
       FROM movie;`;

  const dbResponse = await db.all(getMoviesQuery);
  response.send(dbResponse);
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const updateMoviesData = `
       INSERT INTO movie (director_id, movie_name, lead_actor)
       VALUES (${directorId}, '${movieName}', '${leadActor}');`;

  const dbResponse = await db.run(updateMoviesData);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
       SELECT * 
       FROM 
         movie
       WHERE 
        movie_id = ${movieId};`;

  const dbResponse = await db.get(getMovieQuery);
  response.send(dbResponse);
});

app.put("/movies/:movieId", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const updateMoviesData = `
       UPDATE movie 
       SET 
        director_id = ${directorId}, 
        movie_name = '${movieName}',
        lead_actor =  '${leadActor}'
       WHERE
        movie_id = ${movieId};`;

  await db.run(updateMoviesData);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
       DELETE FROM movie 
       WHERE
        movie_id = ${movieId};`;

  await db.run(deleteMovieQuery);
  response.send("Movie removed");
});

app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `
        SELECT director_name
        FROM director;`;

  const dbResponse = await db.all(getDirectorsQuery);
  response.send(dbResponse);
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getMovieQuery = `
       SELECT movie_name 
       FROM 
         movie
       WHERE 
        director_id = ${directorId};`;

  const dbResponse = await db.all(getMovieQuery);
  response.send(dbResponse);
});
