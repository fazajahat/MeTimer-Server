const { getDB } = require("../config/mongodb.config");
const { ObjectId } = require("mongodb");
const {Journal} = require('../model');
const JournalController = require('../controllers/JournalController');

jest.mock("../config/mongodb.config");
jest.mock("../model/Journal");

describe('Journal', () => {
    describe('create', () => {
        it('should create a journal entry', async () => {
          const mockDB = {
            collection: jest.fn().mockReturnThis(),
            insertOne: jest.fn().mockResolvedValue({ insertedId: 'journalId' }),
          };
          getDB.mockReturnValue(mockDB);
    
          const journalId = await Journal.create('Test Title', 'Test Content');
    
          expect(mockDB.collection).toHaveBeenCalledWith('Journals');
          expect(mockDB.insertOne).toHaveBeenCalledWith({ title: 'Test Title', content: 'Test Content' });
          expect(journalId).toBe('journalId');
        });
    
        it('should throw an error if something goes wrong', async () => {
          const mockDB = {
            collection: jest.fn().mockReturnThis(),
            insertOne: jest.fn().mockRejectedValue(new Error('Test error')),
          };
          getDB.mockReturnValue(mockDB);
    
          await expect(Journal.create('Test Title', 'Test Content')).rejects.toThrow('Test error');
        });
      });

  describe('findById', () => {
    it('should find a journal by id', async () => {
      const mockFindOne = jest.fn().mockResolvedValue({ _id: 'testId', title: 'Test Title', content: 'Test Content' });
      getDB.mockReturnValue({
        collection: () => ({ findOne: mockFindOne })
      });

      const result = await Journal.findById('testId');

      expect(mockFindOne).toHaveBeenCalledWith({ _id: new ObjectId('testId') });
      expect(result).toEqual({ _id: 'testId', title: 'Test Title', content: 'Test Content' });
    });

    it('should throw an error if something goes wrong', async () => {
      const mockFindOne = jest.fn().mockRejectedValue(new Error('Test error'));
      getDB.mockReturnValue({
        collection: () => ({ findOne: mockFindOne })
      });

      await expect(Journal.findById('testId')).rejects.toThrow('Test error');
    });
  });
});

describe('JournalController', () => {
    let mockReq, mockRes, mockNext;
  
    beforeEach(() => {
      mockReq = {
        params: {},
      };
      mockRes = {
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });
  
    describe('findById', () => {
      it('should find a journal by id', async () => {
        mockReq.params.id = 'testId';
        Journal.findById.mockResolvedValue('Test journal');
  
        await JournalController.findById(mockReq, mockRes, mockNext);
  
        expect(Journal.findById).toHaveBeenCalledWith('testId');
        expect(mockRes.json).toHaveBeenCalledWith('Test journal');
      });
  
      it('should log an error if something goes wrong', async () => {
        mockReq.params.id = 'testId';
        const consoleSpy = jest.spyOn(console, 'log');
        Journal.findById.mockRejectedValue(new Error('Test error'));
  
        await JournalController.findById(mockReq, mockRes, mockNext);
  
        expect(consoleSpy).toHaveBeenCalledWith(new Error('Test error'));
      });
    });
  });