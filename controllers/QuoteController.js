const { Quote } = require("../model");

class QuoteController {
    static async generateQuote(req, res, next) {
        const { mood } = req.body;
        try {
            const quote = await Quote.generateQuote(mood);
            res.status(200).json(quote);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = QuoteController;
