require("dotenv").config();
const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require("../app");
const User = require("../models/user");

mongoose.set("strictQuery", false);

const { DB_HOST_TEST } = process.env;

describe("login", () => {
  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);

    await User.deleteMany();

    const testPassword = "1234567";

    const hashPassword = await bcrypt.hash(testPassword, 10);

    const testUser = {
      name: "Iryna Karolina",
      email: "karolina@gmail.com",
      password: hashPassword,
      subscription: "starter",
    };

    await User.create(testUser);
  });

  afterAll(async () => {
    await mongoose.disconnect(DB_HOST_TEST);
  });

  it("should login user", async () => {
    const response = await supertest(app).post("/api/auth/login").send({
      email: "karolina@gmail.com",
      password: "1234567",
    });

    expect(response.status).toBe(200);

    const responseBody = JSON.parse(response.text);
    expect(responseBody).toHaveProperty("token");
  });

  it("should not login user with wrong email", async () => {
    const response = await supertest(app).post("/api/auth/login").send({
      email: "karolina1@gmail.com",
      password: "1234567",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email or password invalid");
  });

  it("should not login user with wrong password", async () => {
    const response = await supertest(app).post("/api/auth/login").send({
      email: "karolina@gmail.com",
      password: "12345678",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email or password invalid");
  });
});
