import mongoose from "mongoose";

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
