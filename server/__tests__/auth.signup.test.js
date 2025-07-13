import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

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

describe("POST /api/auth/signup", () => {
  it("sign up a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Yassine",
      email: "yassine@example.com",
      password: "StrongP@ssw0rd",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch("Please check your inbox (or spam)!");
  });

  it("sign up an existed user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Yassine",
      email: "existed@example.com",
      password: "StrongP@ssw0rd",
    });
    const res1 = await request(app).post("/api/auth/signup").send({
      name: "Yassine",
      email: "existed@example.com",
      password: "StrongP@ssw0rd",
    });

    expect(res1.statusCode).toBe(409);
    expect(res1.body.message).toMatch("User already exists!");
  });

  it("sign up without a name", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "yassine1@example.com",
      password: "StrongP@ssw0rd",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Name is required/);
  });

  it("sign up without an email", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "yassine",
      password: "StrongP@ssw0rd",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Email is required/);
  });

  it("sign up with an invalid email", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "yassine",
      email: "yassine@example",
      password: "StrongP@ssw0rd",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/valid email address/);
  });

  it("sign up without a password", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "yassine",
      email: "yassine2@example.com",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Password is required/);
  });

  it("sign up with a weak password", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "yassine",
      email: "yassine2@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Password/);
  });
});
