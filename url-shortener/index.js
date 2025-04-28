import express from 'express'
import { Pool } from 'pg'
import { ulid } from 'ulid'
import cors from 'cors'
const app = express()
app.use(express.json())
app.use(cors())

const pool = new Pool({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
})
pool.connect()

app.get('/:slug', async (req, res) => {
    const slug = req.params.slug
    const rslt = await pool.query("SELECT url FROM urls WHERE slug = $1", [slug])
    res.redirect(rslt.rows[0].url)
})

app.post('/url', async (req, res) => {
    const slug = ulid().slice(5, 10)
    await pool.query("INSERT INTO urls (slug, url) VALUES ($1, $2)", [slug, req.body.url])
    res.send(req.baseUrl + slug)
})

app.listen(8080, '127.0.0.1')
