import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (error) => console.error("Redis error: " + error));

const redisConnect = async () => {
  if (!redisClient.isReady) {
    try {
      await redisClient.connect();
      console.log("Redis Client Connected Successefully!");
    } catch (error) {
      console.error("Error While Connecting to Redis!", error);
    }
  }
};

const setKey = async (name, value, ttl) => {
  if (!redisClient.isReady) {
    await redisConnect();
  }
  try {
    await redisClient.set(name, value, { EX: ttl });
  } catch (error) {
    console.error(`Error setting the key ${name}`);
  }
};
const getKey = async (name) => {
  if (!redisClient.isReady) {
    await redisConnect();
  }
  try {
    return await redisClient.get(name);
  } catch (error) {
    console.error(`Error getting the key ${name}`);
  }
};
const delKey = async (name) => {
  if (!redisClient.isReady) {
    await redisConnect();
  }
  try {
    await redisClient.del(name);
  } catch (error) {
    console.error(`Error deleting the key ${name}`);
  }
};

export { redisConnect, setKey, getKey, delKey };
export default redisClient;
