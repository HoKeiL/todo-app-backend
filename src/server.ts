import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  addDummyDbItems,
  addDbItem,
  getAllDbItems,
  deleteDbItemById,
  DbItem,
  updateDbItemById,
} from "./db";
import filePath from "./filePath";
import { Client } from "pg";
import { getEnvVarOrFail } from "./getEnvVarOrFail";

addDummyDbItems(3);
const app = express();

/** Parses JSON data in a request automatically */
app.use(express.json());
/** To allow 'Cross-Origin Resource Sharing': https://en.wikipedia.org/wiki/Cross-origin_resource_sharing */
app.use(cors());

// read in contents of any environment variables in the .env file
dotenv.config();
const dbUrl = getEnvVarOrFail("DATABASE_URL");
const client = new Client(dbUrl);
client.connect();

// use the environment variable PORT, or 4000 as a fallback
const PORT_NUMBER = process.env.PORT ?? 4000;

// API info page
app.get("/", (req, res) => {
  const pathToFile = filePath("../public/index.html");
  res.sendFile(pathToFile);
});
//Get all todos from using SQL query
app.get("/todoapp", async (req, res) => {
  const text = "SELECT * FROM todoapp";
  const result = await client.query(text);
  res.status(200).json(result.rows);
});
// GET all todos
app.get("/todoapp", (req, res) => {
  const allTodos = getAllDbItems();
  res.status(200).json(allTodos);
});

//POST new todo
app.post<{}, {}, DbItem>("/todoapp", (req, res) => {
  const postData = req.body;
  const createdSignature = addDbItem(postData);
  res.status(201).json(createdSignature);
});

//PATCH todo status
app.patch<{ id: string }, {}, Partial<DbItem>>("/todoapp/:id", (req, res) => {
  const matchingSignature = updateDbItemById(parseInt(req.params.id), req.body);
  if (matchingSignature === "not found") {
    res.status(404).json(matchingSignature);
  } else {
    res.status(200).json(matchingSignature);
  }
});

//DELETE a todo
app.delete<{ id: string }>("/todoapp/:id", (req, res) => {
  const matchingSignature = deleteDbItemById(parseInt(req.params.id));

  if (matchingSignature === "not found") {
    res.status(404).json(matchingSignature);
  } else {
    res.status(200).json(matchingSignature);
  }
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
