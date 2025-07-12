import mongoose from "mongoose";

/**
 * Connects to the MongoDB server.
 *
 * Checks if MONGODB_URI is defined in the .env file, then connects to MongoDB.
 * Sets up listeners for 'connected', 'error', and 'disconnected' events
 * for better debugging.
 * If connection fails, logs the error and exits the process with code 1.
 *
 * @returns {Promise<void>} Resolves when the connection is successful.
 */
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI)
      throw new Error("MONGODB_URI not defined in .env file!");

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected: " + conn.connection.host);

    mongoose.connection.on("connected", () => {
      console.log("Mongoose default connection open to " + conn.connection.host);
    });

    mongoose.connection.on("error", (err) => {
      console.log("Mongoose default connection error: " + err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose default connection disconnected!");
    });
  } catch (error) {
    console.log("MongoDB Error: " + error.message);
    process.exit(1);
  }
};

export default connectDB;
