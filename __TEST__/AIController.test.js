const {AI} = require("../model");
const request = require('supertest');
const app = require("../app")

describe('/POST /quotes', () => {
    it('should send response with 200 status code', async () => {
        try {
            const response = await request(app)
                .post('/quotes')
                .send({
                    mood: 'happy'
                })
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('quote')
        } catch (err) {
            console.log(err)
        }
    })
    it('should send response with 404 status code', async () => {
        try {
            const response = await request(app)
                .post('/quotes')
                .send({
                    mood: ''
                })
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty('message', 'Missing one or more input in post quote')
        } catch (err) {
            console.log(err)
        }
    })
})

describe('/POST /journalResponse', () => {  
    it('should send response with 200 status code', async () => {
        try {
            const response = await request(app)
                .post('/journalResponse')
                .send({
                    journal_content: 'I feel happy today'
                })
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('response')
        } catch (err) {
            console.log(err)
        }
    })
    it('should send response with 404 status code', async () => {
        try {
            const response = await request(app)
                .post('/journalResponse')
                .send({
                    journal_content: ''
                })
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty('message', 'Missing one or more input in post journal')
        } catch (err) {
            console.log(err)
        }
    })
})

