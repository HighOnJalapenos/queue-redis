import { createClient } from "redis";

const client = createClient();

type Problem = {
  problemId: string;
  userId: string;
  code: string;
  lang: string;
};

async function processTheCode(problem: string) {
  const { problemId, userId, code, lang }: Problem = JSON.parse(problem);
  try {
    console.log("Processing the code for the problem ", problemId);
    // Process the code. For eg leetcode will run the code here
    console.log("Started processing the code");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("Finished processing the code for the problem ", problemId);
  } catch (error) {
    console.log("Error adding problem to queue", error);
  }
}

async function startWorker() {
  try {
    await client.connect();
    console.log("Connected to Redis");

    while (true) {
      const result = await client.brPop("problems", 0);
      if (result !== null) {
        await processTheCode(result.element);
      }
    }
  } catch (error) {
    console.log("Error connecting to Redis", error);
  }
}

startWorker();
