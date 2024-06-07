import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConn from "./helpers/db";
import { createContactDetail } from "./controllers/Contact";
dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});



app.post("/identify", (req:Request, res: Response) => {
  createContactDetail(req,res, dbConn );
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });