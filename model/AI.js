const path = require("path");
const fs = require("fs");
const { getDB } = require("../config/mongodb.config");
const openai = require("../config/openai.config");

class AI {
    static async generateQuote(mood = "mindfulness") {
        try {
            const prompt = `write me a quotes about ${mood}.`;

            const response = await openai.completions.create({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 2048,
                temperature: 1
            });

            const quoteResponse = response.choices[0].text.replace(/\n\n/, "");

            // mencari quote apakah ada di database jika ada return hasil di database
            const findQuote = await getDB().collection("Quotes").findOne({ quote: quoteResponse });
            if (findQuote) return findQuote;

            const voiceResponse = await openai.audio.speech.create({
                model: "tts-1",
                voice: "alloy",
                input: quoteResponse
            });

            // create mp3 file to public static path
            const fileVoiceName = `${quoteResponse.split(" ")[0].replace('"', "")}-${quoteResponse.split(" ")[1]}-${
                quoteResponse.split(" ")[2]
            }-${new Date().getTime()}.mp3`;
            const pathVoiceName = path.join(__dirname + "/../public/music/" + fileVoiceName);
            const bufferVoice = Buffer.from(await voiceResponse.arrayBuffer());
            await fs.promises.writeFile(pathVoiceName, bufferVoice);

            // create data in database
            const insertData = { quote: quoteResponse, voiceFile: fileVoiceName };
            await getDB().collection("Quotes").insertOne(insertData);

            return insertData;
        } catch (error) {
            throw error;
        }
    }

    static async journalResponse(journalContent) {
        try {
            const prompt = `give me a 1 or 2 sentence motivational human response about this journal "${journalContent}".`;

            const response = await openai.completions.create({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 2048,
                temperature: 1
            });
            const journalResponse = response.choices[0].text;
            return journalResponse;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AI;
