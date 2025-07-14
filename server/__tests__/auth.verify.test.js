import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/user.model.js";
import app from "../app.js";
import mongoose from "mongoose";
import crypto from "crypto";

let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  try {
    await mongoose.connect(mongoServer.getUri());
    console.log("Mongoose Connected!");
  } catch (error) {
    console.log("Error connecting Mongoose!");
  }
});
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Get /api/auth/verify", () => {
  let token;
  const userInfo = {
    name: "yassine",
    email: "yassine@example.com",
    password: "StrongP@ssw0rd",
  };
  it("email is not verified after signup", async () => {
    await request(app).post("/api/auth/signup").send(userInfo);
    const user = await User.findOne({ email: userInfo.email });
    token = user.verificationToken;

    expect(user.verified).toBe(false);
  });
  it("verify email", async () => {
    const res = await request(app).get(`/api/auth/verify/${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/email verified/i);

    const user = await User.findOne({ email: userInfo.email });

    expect(user.verified).toBe(true);
    expect(user.verificationToken).toBe(null);
    expect(user.verificationTokenExpires).toBe(null);
  });
  it("should not verify again with same token", async () => {
    const res = await request(app).get(`/api/auth/verify/${token}`);
    expect(res.statusCode).toBe(403);
  });
  it("expired token", async () => {
    const userInfo = {
      name: "yassine",
      email: "yassine1@example.com",
      password: "StrongP@ssw0rd",
    };
    await request(app).post("/api/auth/signup").send(userInfo);

    const user = await User.findOne({ email: userInfo.email });

    // Set verfication token expiry date to 1min in the past
    user.verificationTokenExpires = new Date(Date.now() - 1 * 60 * 1000);
    await user.save();

    const res = await request(app).get(`/api/auth/verify/${user.verificationToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch("Verification link expired (or not found)!");
  });
  it("random Verification token", async () => {
    const randomVerificationToken = crypto.randomBytes(32).toString("hex");
    const res = await request(app).get(`/api/auth/verify/${randomVerificationToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch("Verification link expired (or not found)!");
  });
});
