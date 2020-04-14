const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project Id." });
  }

  return next();
}

function validateRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
  // TODO
});

app.put(
  "/repositories/:id",
  validateProjectId,
  validateRepositoryExists,
  (request, response) => {
    const { title, url, techs } = request.body;
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(
      (repository) => repository.id === id
    );

    const repository = {
      id,
      title,
      url,
      techs,
      likes: repositories[repositoryIndex].likes,
    };

    repositories[repositoryIndex] = repository;

    return response.json(repository);

    // TODO
  }
);

app.delete(
  "/repositories/:id",
  validateProjectId,
  validateRepositoryExists,
  (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(
      (repository) => repository.id === id
    );

    repositories.splice(repositoryIndex, 1);
    return response.status(204).send();
  }
);

app.post(
  "/repositories/:id/like",
  validateProjectId,
  validateRepositoryExists,
  (request, response) => {
    // TODO
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(
      (repository) => repository.id === id
    );

    repositories[repositoryIndex].likes += 1;

    return response.json(repositories[repositoryIndex]);
  }
);

module.exports = app;
