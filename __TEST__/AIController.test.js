const { getDB } = require("../config/mongodb.config");
const openai = require("../config/openai.config");
const {AI} = require('../model');
// const fs = require("fs");
const AIController = require('../controllers/AIController');


jest.mock("../config/mongodb.config");
jest.mock("../config/openai.config");
jest.mock("../model");
jest.mock("fs");

describe('AI', () => {
  describe('generateQuote', () => {
    it('should generate a quote', async () => {
      const mockFindOne = jest.fn().mockResolvedValue(null);
      const mockInsertOne = jest.fn().mockResolvedValue({ insertedId: 'testId' });
      getDB.mockReturnValue({
        collection: () => ({ findOne: mockFindOne, insertOne: mockInsertOne })
      });

      openai.completions.create.mockResolvedValue({
        choices: [{ text: 'Test quote' }]
      });

      openai.audio.speech.create.mockResolvedValue({
        arrayBuffer: () => Buffer.from('Test audio')
      });

      const result = await AI.generateQuote();

      expect(mockFindOne).toHaveBeenCalled();
      expect(mockInsertOne).toHaveBeenCalled();
      expect(result).toEqual({ quote: 'Test quote', voiceFile: expect.any(String) });
    });
  });

  describe('journalResponse', () => {
    it('should generate a journal response', async () => {
      openai.completions.create.mockResolvedValue({
        choices: [{ text: 'Test response' }]
      });

      const result = await AI.journalResponse('Test journal content');

      expect(result).toBe('Test response');
    });
  });

  describe('responseChatAI', () => {
    it('should generate a chat response', async () => {
      const mockInsertOne = jest.fn().mockResolvedValue({ insertedId: 'testId' });
      const mockFind = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockReturnThis();
      const mockToArray = jest.fn().mockResolvedValue([{ question: 'Test question', answer: 'Test answer' }]);
      getDB.mockReturnValue({
        collection: () => ({ insertOne: mockInsertOne, find: mockFind, sort: mockSort, toArray: mockToArray })
      });

      openai.completions.create.mockResolvedValue({
        choices: [{ text: 'Test response' }]
      });

      const result = await AI.responseChatAI('Test chat', 'testId');

      expect(mockInsertOne).toHaveBeenCalled();
      expect(mockFind).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalled();
      expect(mockToArray).toHaveBeenCalled();
      expect(result).toEqual([{ question: 'Test question', answer: 'Test answer' }]);
    });
  });

  describe('getChatAI', () => {
    it('should get chat logs', async () => {
      const mockFind = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockReturnThis();
      const mockToArray = jest.fn().mockResolvedValue([{ question: 'Test question', answer: 'Test answer' }]);
      getDB.mockReturnValue({
        collection: () => ({ find: mockFind, sort: mockSort, toArray: mockToArray })
      });

      const result = await AI.getChatAI('testId');

      expect(mockFind).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalled();
      expect(mockToArray).toHaveBeenCalled();
      expect(result).toEqual([{ question: 'Test question', answer: 'Test answer' }]);
    });
  });
});



describe('AIController', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: { _id: 'userId' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('generateQuote', () => {
    it('should generate a quote', async () => {
      mockReq.body.mood = 'happy';
      AI.generateQuote.mockResolvedValue('Test quote');

      await AIController.generateQuote(mockReq, mockRes, mockNext);

      expect(AI.generateQuote).toHaveBeenCalledWith('happy');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith('Test quote');
    });

    it('should call next with an error if something goes wrong', async () => {
      mockReq.body.mood = 'happy';
      AI.generateQuote.mockRejectedValue(new Error('Test error'));

      await AIController.generateQuote(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Test error'));
    });
  });
  describe('journalResponse', () => {
    it('should generate a journal response', async () => {
      mockReq.body.journal_content = 'Test content';
      AI.journalResponse.mockResolvedValue('Test response');

      await AIController.journalResponse(mockReq, mockRes, mockNext);

      expect(AI.journalResponse).toHaveBeenCalledWith('Test content');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ response: 'Test response' });
    });

    it('should call next with an error if something goes wrong', async () => {
      mockReq.body.journal_content = 'Test content';
      AI.journalResponse.mockRejectedValue(new Error('Test error'));

      await AIController.journalResponse(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Test error'));
    });
  });
  describe('postChatAI', () => {
    it('should post a chat and return chat logs', async () => {
      mockReq.body.chat = 'Test chat';
      AI.responseChatAI.mockResolvedValue('Test chat logs');

      await AIController.postChatAI(mockReq, mockRes, mockNext);

      expect(AI.responseChatAI).toHaveBeenCalledWith('Test chat', 'userId');
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith('Test chat logs');
    });

    it('should call next with an error if something goes wrong', async () => {
      mockReq.body.chat = 'Test chat';
      AI.responseChatAI.mockRejectedValue(new Error('Test error'));

      await AIController.postChatAI(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Test error'));
    });
  });
  describe('getChatLogs', () => {
    it('should get chat logs', async () => {
      AI.getChatAI.mockResolvedValue('Test chat logs');

      await AIController.getChatLogs(mockReq, mockRes, mockNext);

      expect(AI.getChatAI).toHaveBeenCalledWith('userId');
      expect(mockRes.send).toHaveBeenCalledWith('Test chat logs');
    });

    it('should call next with an error if something goes wrong', async () => {
      AI.getChatAI.mockRejectedValue(new Error('Test error'));

      await AIController.getChatLogs(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Test error'));
    });
  });
});