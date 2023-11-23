const { AI } = require("../model");

class AIController {
    static async generateQuote(req, res, next) {
        const { mood } = req.body;
            const quote = await AI.generateQuote(mood);
            res.status(201).json(quote);
    }

    static async journalResponse(req, res, next) {
        const { journal_content } = req.body;
        const journalResponse = await AI.journalResponse(journal_content);
        res.status(200).json({ response: journalResponse });
    }

    static async postChatAI(req, res, next) {
        const { id } = req.user;
        const { chat } = req.body;
        const chatLogs = await AI.responseChatAI(chat, id);
        res.status(201).json(chatLogs);
    }

    static async getChatLogs(req, res, next) {
        const { id } = req.user;
        const chatLogs = await AI.getChatAI(id);
        res.send(chatLogs);
    }
}

module.exports = AIController;
