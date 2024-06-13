import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import contactRouter from "./routes/contact";
dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api/contact", contactRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
