import express from 'express'
import { Pool } from 'pg'
import * as v from 'valibot'
import cookieParser from 'cookie-parser'
import handleError from './middleware/handleError.js'
import TweetSchema from './schema/tweet.js'
import auth from './middleware/auth.js'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(auth)
const PORT = 8081

const pool = new Pool({
    user: 'twitter',
    password: 'twitter',
    host: 'localhost',
    port: 5433,
    database: 'twitter'
})
await pool.connect()

app.post('/', async (req, res) => {
    const uid = req.userId
    const text = req.body.text

    try {
        const request = v.parse(TweetSchema, { uid, text })
        // todo: add feature like sentiment analysis, or use a message queue
        await pool.query('INSERT INTO tweets(uid, text) VALUES ($1, $2)', [request.uid, request.text])
        res.send({ data: { uid, text } })
    } catch (e) {
        return handleError(e, res)
    }
})

app.listen(PORT, 'localhost', () => {
    console.log(`The tweet service is running on http://localhost:${PORT}`)
})
