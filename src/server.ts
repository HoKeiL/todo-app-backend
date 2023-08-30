import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DbItem } from "./db";
import filePath from "./filePath";
import { Client, QueryResult } from "pg";
import { getEnvVarOrFail } from "./getEnvVarOrFail";

const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();
const dbUrl = getEnvVarOrFail("DATABASE_URL");
const client = new Client(dbUrl);
client.connect();

const PORT_NUMBER = process.env.PORT ?? 4000;

// API info page
app.get("/", (req, res) => {
  const pathToFile = filePath("../public/index.html");
  res.sendFile(pathToFile);
});

//Get all todos from using SQL query
app.get("/todoapp", async (req, res) => {
  try {
    const text = "SELECT * FROM todoapp";
    const result = await client.query(text);
    queryAndLog(result, text);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(`there is an error: ${error}`);
  }
});

// POST new todo from using SQL query
app.post<{}, {}, DbItem>("/todoapp", async (req, res) => {
  try {
    const postData = req.body;
    const text =
      "INSERT INTO todoapp(task, duedate, completed) VALUES($1, $2, $3)";
    const value = [postData.task, postData.duedate, postData.completed];
    const result = await client.query(text, value);
    queryAndLog(result, text, value);
    res.status(201).json(result.rows);
    console.log(`${result.rows} has been added`);
  } catch (error) {
    console.error(`there is an error: ${error}`);
  }
});

// PATCH a todo using SQL query

app.patch<{ id: string }, {}, Partial<DbItem>>(
  "/todoapp/:id",
  async (req, res) => {
    try {
      const matchingId = parseInt(req.params.id);
      const patchData = req.body;
      const queryText = "UPDATE todoapp SET completed = $2 WHERE id = $1";
      const values = [matchingId, patchData.completed];
      const result = await client.query(queryText, values);
      queryAndLog(result, queryText, values);
      res.status(200).json({
        message: "todo status has been updated",
        updated: result.rows,
      });
    } catch (error) {
      console.error(`there is an error: ${error}`);
      res
        .status(404)
        .json("todo status cannot be updated, please try again later.");
    }
  }
);

// DELETE a todo using SQL query

app.delete<{ id: string }>("/todoapp/:id", async (req, res) => {
  try {
    const matchingId = parseInt(req.params.id);
    const queryText = "DELETE FROM todoapp WHERE id = $1";
    const values = [matchingId];
    const result = await client.query(queryText, values);
    queryAndLog(result, queryText, values);
    res.status(200).json({
      message: `todo ${matchingId} has been deleted`,
      row: result.rows,
    });
  } catch (error) {
    console.error(`there is an error: ${error}`);
    res.status(404).json({
      message: `Selected todo cannot be deleted, please try again`,
    });
  }
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});

//need to left padded and increment by each querylog
function formatQNum(q: number): string {
  let qNum: string;
  if (q < 10) {
    qNum = `000${q}`;
  } else if (q >= 10 && q <= 99) {
    qNum = `00${q}`;
  } else if (q >= 100 && q <= 999) {
    qNum = `0${q}`;
  } else {
    qNum = `${q}`;
  }

  return qNum;
}
function increment(n: number): number {
  n++;
  return n;
}
let currentQNum = 0;

async function queryAndLog(
  client: QueryResult<any>,
  sql: string,
  params?: (number | string | boolean | undefined)[]
): Promise<void> {
  const qNum = formatQNum(currentQNum);

  console.log(`SQL START  qNum: ${qNum} SQL: ${sql} params: ${params}`);
  const startTime = performance.now();
  const stopTime = performance.now();
  const elapsedTime = stopTime - startTime;
  const rowCount = client.rowCount;
  console.log(
    `SQL END   qNum: ${qNum} time:  ${elapsedTime}ms rowCount:  ${rowCount} sql:  ${sql}  params: ${params}`
  );
  currentQNum = increment(currentQNum);
}
