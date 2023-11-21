const { getDB } = require("../config/mongodb.config");
const { ObjectId } = require("mongodb");
const {Journal} = require('../model');
const {Record} = require('../model');
const RecordController = require('../controllers/RecordController');

jest.mock("../config/mongodb.config");
jest.mock("../model/Journal");
jest.mock("../model/Record");

describe('Record', () => {
  describe('create', () => {
    it('should create a record', async () => {
      const mockInsertOne = jest.fn().mockResolvedValue({ insertedId: 'testId' });
      getDB.mockReturnValue({
        collection: () => ({ insertOne: mockInsertOne })
      });

      Journal.create.mockResolvedValue('journalId');

      const data = { rateMood: 5, moods: ['happy'], title: 'Test Title', content: 'Test Content' };
    //   const userId = 'userId';
    const userId = new ObjectId().toString();
      const result = await Record.create(data, userId);

      expect(Journal.create).toHaveBeenCalledWith(data.title, data.content);
      expect(mockInsertOne).toHaveBeenCalledWith({
        rateMood: data.rateMood,
        moods: data.moods,
        journalId: new ObjectId('journalId'),
        date: expect.any(Date),
        userId: new ObjectId(userId)
      });
      expect(result).toEqual({ insertedId: 'testId' });
    });

    it('should throw an error if something goes wrong', async () => {
      const mockInsertOne = jest.fn().mockRejectedValue(new Error('Test error'));
      getDB.mockReturnValue({
        collection: () => ({ insertOne: mockInsertOne })
      });

      const data = { rateMood: 5, moods: ['happy'], title: 'Test Title', content: 'Test Content' };
      const userId = 'userId';

      await expect(Record.create(data, userId)).rejects.toThrow('Test error');
    });
  });
  describe('findAll', () => {
    it('should find all records by user id', async () => {
      const mockAggregate = jest.fn().mockReturnThis();
      const mockToArray = jest.fn().mockResolvedValue([{ _id: 'testId', rateMood: 5, moods: ['happy'], journalId: 'journalId', date: new Date(), userId: 'userId' }]);
      getDB.mockReturnValue({
        collection: () => ({ aggregate: mockAggregate, toArray: mockToArray })
      });

      const result = await Record.findAll('userId');

      expect(mockAggregate).toHaveBeenCalled();
      expect(mockToArray).toHaveBeenCalled();
      expect(result).toEqual([{ _id: 'testId', rateMood: 5, moods: ['happy'], journalId: 'journalId', date: expect.any(Date), userId: 'userId' }]);
    });

    it('should throw an error if something goes wrong', async () => {
      const mockAggregate = jest.fn().mockReturnThis();
      const mockToArray = jest.fn().mockRejectedValue(new Error('Test error'));
      getDB.mockReturnValue({
        collection: () => ({ aggregate: mockAggregate, toArray: mockToArray })
      });

      await expect(Record.findAll('userId')).rejects.toThrow('Test error');
    });
  });
});
describe('RecordController', () => {
    let mockReq, mockRes, mockNext;
  
    beforeEach(() => {
      mockReq = {
        body: {},
        user: { id: 'userId' }
      };
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });
  
    describe('createRecord', () => {
      it('should create a record', async () => {
        mockReq.body = 'Test data';
        Record.create.mockResolvedValue('Test response');
  
        await RecordController.createRecord(mockReq, mockRes, mockNext);
  
        expect(Record.create).toHaveBeenCalledWith('Test data', 'userId');
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith('Test response');
      });
  
      it('should log an error if something goes wrong', async () => {
        mockReq.body = 'Test data';
        const consoleSpy = jest.spyOn(console, 'log');
        Record.create.mockRejectedValue(new Error('Test error'));
  
        await RecordController.createRecord(mockReq, mockRes, mockNext);
  
        expect(consoleSpy).toHaveBeenCalledWith(new Error('Test error'));
      });
    });
  
    describe('getRecords', () => {
      it('should get records', async () => {
        Record.findAll.mockResolvedValue('Test records');
  
        await RecordController.getRecords(mockReq, mockRes, mockNext);
  
        expect(Record.findAll).toHaveBeenCalledWith('userId');
        expect(mockRes.json).toHaveBeenCalledWith('Test records');
      });
  
      it('should log an error if something goes wrong', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        Record.findAll.mockRejectedValue(new Error('Test error'));
  
        await RecordController.getRecords(mockReq, mockRes, mockNext);
  
        expect(consoleSpy).toHaveBeenCalledWith(new Error('Test error'));
      });
    });
  });