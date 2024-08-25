import express, { Request, Response } from "express";
import { createClient, RedisClientType } from "redis";

const app = express();
app.use(express.json());
const client: RedisClientType = createClient();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

type Problem = {
  problemId: string;
  userId: string;
  code: string;
  lang: string;
};

app.post("/add", async (req: Request, res: Response) => {
  const { problemId, userId, code, lang }: Problem = req.body;
  try {
    await client.lPush(
      "problems",
      JSON.stringify({ problemId, userId, code, lang })
    );
    res.status(200).send("Added problem to queue");
  } catch (error) {
    console.log("Error adding problem to queue", error);
    res.status(500).send("Error adding problem to queue");
  }
});

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to Redis");

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.log("Error connecting to Redis", error);
  }
}

startServer();
