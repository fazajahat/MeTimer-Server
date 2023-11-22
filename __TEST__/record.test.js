const request = require('supertest');
const app = require('../app'); 
const { Record } = require('../model');

jest.mock('../model');

describe('POST /record', () => {
  it('should create a new record', async () => {
    const mockData = {
      title: 'Test Record',
      content: 'Test Content'
    };
    const mockUser = {
      id: 'userId'
    };
    const mockResponse = {
      _id: 'recordId',
      ...mockData,
      userId: mockUser.id
    };

    Record.create.mockResolvedValue(mockResponse);

    const res = await request(app)
      .post('/records')
      .send(mockData)
      .set('user', mockUser);

    expect(Record.create).toHaveBeenCalledWith(mockData, mockUser.id);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(mockResponse);
  });
});