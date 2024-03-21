import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import splTokenTransfer from "./src/spl_token_transfer";
const spltoken = require("./dist/spl-token");
//For env File
dotenv.config();
splTokenTransfer();
const app: Application = express();
const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.listen(port, () => {
  console.log(`Server is work at http://localhost:${port}`);
});
