const {User} = require("../model");
const request = require('supertest');
const app = require("../app")
const { getDB } = require("../config/mongodb.config");


jest.mock("../config/mongodb.config");



const userTest = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@mail.com',
    password: 'john123'
}


describe('POST /register', () => {
    afterAll(async () => {
        try {
            await User.deleteMany({})
        } catch (err) {
            console.log(err)
        }
    })
    it('should send response with 201 status code', async () => {
        try {
            const response = await request(app)
                .post('/register')
                .send(userTest)
            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty('message', 'New user successfully created')
            expect(response.body).toHaveProperty('id')
        } catch (err) {
            console.log(err)
        }
    })
    it('should send response with 404 status code', async () => {
        try {
            const response = await request(app)
                .post('/register')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: '',
                })
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty('message', 'Missing one or more input in post register')
        } catch (err) {
            console.log(err)
        }
    })
    it('should send response with 409 status code', async () => {
        try {
            const response = await request(app)
                .post('/register')
                .send(userTest)
            expect(response.status).toBe(409)
            expect(response.body).toHaveProperty('message', 'Username or email already exist')
        } catch (err) {
            console.log(err)
        }
    })
})

describe('POST /login', () => {
    it('should send response with 200 status code', async () => {
        try {
            const response = await request(app)
                .post('/login')
                .send(userTest)
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('access_token')
        } catch (err) {
            console.log(err)
        }
    })
    it('should send response with 404 status code', async () => {
        try {
            const response = await request(app)
                .post('/login')
                .send({
                    email: '',
                    password: ''
                })
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty('message', 'Missing email in post login')
        } catch (err) {
            console.log(err)
        }
    })
    it('should send response with 401 status code', async () => {
        try {
            const response = await request(app)
                .post('/login')
                .send({
                    email: 'johndoe@mail.com',
                    password: 'wrongpass'
                })
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message', 'Email or password is incorrect')
        } catch (err) {
            console.log(err)
        }
    })
})

describe('User Model', () => {
    afterAll(async () => {
        try {
            await User.deleteMany({})
        } catch (err) {
            console.log(err)
        }
    })
    it('should create new user', async () => {
        try {
            const response = await User.create(userTest)
            expect(response.ops[0]).toHaveProperty('_id')
            expect(response.ops[0]).toHaveProperty('firstName', 'John')
            expect(response.ops[0]).toHaveProperty('lastName', 'Doe')
            expect(response.ops[0]).toHaveProperty('email', 'johndoe@mail.com')
            expect(response.ops[0]).toHaveProperty('password')
        } catch (err) {
            console.log(err)
        }
    })
    it('should find all users', async () => {
        try {
            const response = await User.findAll()
            expect(response).toEqual(expect.any(Array))
        } catch (err) {
            console.log(err)
        }
    })
    it('should find user by id', async () => {
        try {
            const response = await User.findByPk('5e8b7b3d7f0f4f3b3c1a2b2c')
            expect(response).toHaveProperty('_id')
            expect(response).toHaveProperty('firstName', 'John')
            expect(response).toHaveProperty('lastName', 'Doe')
            expect(response).toHaveProperty('email', 'johndoe@mail.com')
            expect(response).toHaveProperty('password')
        } catch (err) {
            console.log(err)
        }
    })
    it('should find user by email', async () => {
        try {
            const response = await User.findByEmail('johndoe@mail.com')
            expect(response).toHaveProperty('_id')
            expect(response).toHaveProperty('firstName', 'John')
            expect(response).toHaveProperty('lastName', 'Doe')
            expect(response).toHaveProperty('email', 'johndoe@mail.com')
            expect(response).toHaveProperty('password')
        } catch (err) {
            console.log(err)
        }
    })
    it('should find user by id', async () => {
        try {
            const response = await User.findById('5e8b7b3d7f0f4f3b3c1a2b2c')
            expect(response).toHaveProperty('_id')
            expect(response).toHaveProperty('firstName', 'John')
            expect(response).toHaveProperty('lastName', 'Doe')
            expect(response).toHaveProperty('email', 'johndoe@mail.com')
            expect(response).toHaveProperty('password')
        } catch (err) {
            console.log(err)
        }
    })
    it('should find or create user', async () => {
        try {
            const response = await User.findOrCreate('johndoe@mail.com', userTest)
            if(response === null) {
                const newUser = await User.findByEmail('johndoe@mail.com')
                expect(newUser).toHaveProperty('_id')
                expect(newUser).toHaveProperty('firstName', 'John')
                expect(newUser).toHaveProperty('lastName', 'Doe')
                expect(newUser).toHaveProperty('email', 'johndoe@mail.com')
                expect(newUser).toHaveProperty('password')
            }

        } catch (err) {
            console.log(err)
        }
    })
    it('should update user', async () => {
        try {
            const response = await User.update('5e8b7b3d7f0f4f3b3c1a2b2c', {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'janedoe@mail.com',
                password: 'jane123'
            })
            expect(response).toHaveProperty('_id')
            expect(response).toHaveProperty('firstName', 'Jane')
            expect(response).toHaveProperty('lastName', 'Doe')
            expect(response).toHaveProperty('email', 'janedoe@mail.com')
            expect(response).toHaveProperty('password')
        } catch (err) {
            console.log(err)
        }
    })
    it('should delete user', async () => {
        try {
            const response = await User.destroy('5e8b7b3d7f0f4f3b3c1a2b2c')
            expect(response).toHaveProperty('_id')
            expect(response).toHaveProperty('firstName', 'Jane')
            expect(response).toHaveProperty('lastName', 'Doe')
            expect(response).toHaveProperty('email', 'janedoe@mail.com')
            expect(response).toHaveProperty('password')
        } catch (err) { 
            console.log(err)
        }
    })

})
       


describe('User', () => {
  describe('findOrCreate', () => {
    it('should find or create a user', async () => {
      const mockFindOneAndUpdate = jest.fn().mockResolvedValue(null);
      const mockFindOne = jest.fn().mockResolvedValue({ _id: 'testId' });
      getDB.mockReturnValue({
        collection: () => ({ findOneAndUpdate: mockFindOneAndUpdate, findOne: mockFindOne })
      });

      const result = await User.findOrCreate('test@example.com', { name: 'Test User' });

      expect(mockFindOneAndUpdate).toHaveBeenCalled();
      expect(mockFindOne).toHaveBeenCalled();
      expect(result).toBe('testId');
    });

    it('should return 0 if user already exists', async () => {
      const mockFindOneAndUpdate = jest.fn().mockResolvedValue({ value: { _id: 'testId' } });
      getDB.mockReturnValue({
        collection: () => ({ findOneAndUpdate: mockFindOneAndUpdate })
      });

      const result = await User.findOrCreate('test@example.com', { name: 'Test User' });

      expect(mockFindOneAndUpdate).toHaveBeenCalled();
      expect(result).toBe(0);
    });
  });
});