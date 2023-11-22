require("dotenv").config();
const request = require("supertest");
const app = require("../app")
const { getDB } = require("../config/mongodb.config");





afterAll(async () => {
    const db = getDB();
    await db.dropDatabase();
  })

describe('POST /register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'password123'
        });
  
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'New user successfully created');
      expect(res.body).toHaveProperty('id');
    });
  });
  
  describe('POST /login', () => {
    it('should login a user', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
  
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('access_token');
    });
  });