require("dotenv").config();
const request = require("supertest");
const app = require("../app");
const { getDB, connectDB } = require("../config/mongodb.config");

let token;

beforeAll(async () => {
  await connectDB();
  await getDB().collection("Users").deleteMany({});

  await request(app).post("/register").send({
    firstName: "Test",
    lastName: "User",
    email: "login@example.com",
    password: "password123",
  });
  const res = await request(app).post("/login").send({
    email: "login@example.com",
    password: "password123",
  });
  token = res.body.access_token;
}, 10000);

describe("POST /register", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/register").send({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "New user successfully created");
    expect(res.body).toHaveProperty("id");
    expect(typeof res.body.id).toEqual("string");
  });

  it("should return an error with missing input", async () => {
    const response = await request(app).post("/register").send({});

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Missing one or more input in post register"
    );
  });
});

// POST REGISTER ERROR ALREADY EXISTS
describe("POST /register", () => {
  it("should return an error with existing email", async () => {
    const response = await request(app).post("/register").send({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty(
      "message",
      "Username or email already exist"
    );
  });
});

describe("POST /login", () => {
  it("should login a user", async () => {
    const res = await request(app).post("/login").send({
      email: "login@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("access_token");
  });
});

describe("GET /users", () => {
  it("should return user details", async () => {
    const response = await request(app)
      .get("/users")
      .set("access_token", token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(typeof response.body._id).toBe("string");
    expect(response.body).toHaveProperty("email");
    expect(typeof response.body.email).toBe("string");
    expect(response.body).toHaveProperty("password");
    expect(typeof response.body.password).toBe("string");
    expect(response.body).toHaveProperty("firstName");
    expect(typeof response.body.firstName).toBe("string");
    expect(response.body).toHaveProperty("lastName");
    expect(typeof response.body.lastName).toBe("string");
    expect(new Date(response.body.createdAt)).toBeInstanceOf(Date);
    expect(new Date(response.body.updatedAt)).toBeInstanceOf(Date);
  });
});

// LOGIN ERROR INVALID PASSWORD
describe("POST /login", () => {
  it("should return an error with invalid password", async () => {
    const response = await request(app).post("/login").send({
      email: "login@example.com",
      password: "wrongpass",
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Email or password is incorrect"
    );
  });

  it("should return an error with invalid email", async () => {
    const response = await request(app).post("/login").send({
      email: "error@examp.com",
      password: "password123",
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Email or password is incorrect"
    );
  });
});


// INVALID INPUT LOGIN
describe("POST /login", () => {
  it("should return an error with invalid input", async () => {
    const response = await request(app).post("/login").send({});

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Missing email in post login"
    );
  });
  it("should return an error with invalid input", async () => {
    const response = await request(app).post("/login").send({email: 'email@mail.com'});

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Missing password in post login"
    );
  });
});