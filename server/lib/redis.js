import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (error) => console.error("Redis error: " + error));

/**
 * Connects the Redis client.
 *
 * Checks if the client is not already connected, then connects.
 *
 * @returns {Promise<void>}
 */
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

/**
 * Sets (saves) a key in the Redis database.
 *
 * If the client is not connected, connects first.
 * Then sets the key with a time to live (TTL).
 *
 * @param {string} name - The name of the key to save.
 * @param {string} value - The value to store.
 * @param {number} ttl - Time to live in seconds.
 * @returns {Promise<void>}
 */
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

/**
 * Retrieves a key's value from the Redis database.
 *
 * If the client is not connected, connects first.
 * Then gets the value for the given key.
 *
 * @param {string} name - The name of the key to retrieve.
 * @returns {Promise<string | null>} The value of the key, or null if not found.
 */
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

/**
 * Deletes a key from the Redis database.
 *
 * If the client is not connected, connects first.
 * Then deletes the key.
 *
 * @param {string} name - The name of the key to delete.
 * @returns {Promise<void>}
 */
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
