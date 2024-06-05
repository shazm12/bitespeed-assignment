import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mysqlConn from "./helpers/conn";
dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

mysqlConn.connect((err) => {
  if(err) throw err;
  console.log("Connected to DB");
});

app.post("/identify", (req:Request, res: Response) => {

  res.send({ success: "Done" });

})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });