import express from 'express'
import { Pool } from 'pg'
import * as v from 'valibot'
import handleError from './middleware/handleError.js'
import HttpError from './error/HttpError.js'
import UserSchema from './schema/user.js'
import bcrypt from 'bcrypt'
import randomString from './util/generateString.js'
import auth from './middleware/auth.js'
import FollowSchema from './schema/follow.js'

const app = express()
app.use(express.json())
const PORT = 8080

export const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5433,
    database: 'twitter'
})

export const replica1 = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5434,
    database: 'twitter'
})

export const replica2 = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5435,
    database: 'twitter'
})
await pool.connect()
await replica1.connect()
await replica2.connect()

let replicaIndex = 0;
function getReplica() {
  replicaIndex = (replicaIndex + 1) % 2;
  return replicaIndex === 0 ? replica1 : replica2;
}

app.get('/', (_, res) => {
    res.sendFile(import.meta.dirname + "/index.html")
})

app.post('/users', async (req, res) => {
    try {
        const user = v.parse(UserSchema, {
            name: req.body.name,
            password: req.body.password
        })
        const totalUserWithSameName = await pool.query('SELECT name FROM users WHERE name = $1', [user.name])
        if (totalUserWithSameName.rowCount !== 0) {
            throw new HttpError(400, 'User with the name already exist')
        }

        user.password = await bcrypt.hash(user.password, 10)
        await pool.query('INSERT INTO users(name, password) VALUES ($1, $2)', [user.name, user.password])
        res.send({ data: { name: user.name } })

    } catch (e) {
        return handleError(e, res)
    }
})

app.post('/users/login', async (req, res) => {
    try {
        const request = v.parse(UserSchema, {
            name: req.body.name,
            password: req.body.password
        })

        const user = await pool.query('SELECT name, password FROM users WHERE name = $1', [request.name])
        if (!user.rows[0]) {
            throw new HttpError(401, 'Username or password is wrong')
        }
        const isPasswordValid = await bcrypt.compare(request.password, user.rows[0].password)
        if (!isPasswordValid) {
            throw new HttpError(401, 'Username or password is wrong')
        }

        const sessionId = await randomString();
        await pool.query('UPDATE users SET session_id = $1 WHERE name = $2', [sessionId, request.name])

        res.send({ data: { token: sessionId } })
    } catch (e) {
        return handleError(e, res)
    }
})

app.use(auth)

app.get('/timeline', async (req, res) => {
    const did = req.userId

    try {
        const row = await getReplica().query('SELECT t.uid,text,created_at FROM tweets t JOIN followers f ON t.uid = f.tid WHERE f.did = $1 ORDER BY t.created_at DESC LIMIT 10', [did])
        res.send({ data: row.rows })
    } catch (e) {
        return handleError(e, res)
    }
})

app.post('/users/follow/:tid', async (req, res) => {
    const tid = req.params.tid
    const did = req.userId

    if (tid === did) { throw new HttpError(400, 'I love myself') }

    try {
        v.parse(FollowSchema, { did, tid })
        const target = await pool.query('SELECT id FROM users WHERE id = $1', [tid])
        if (target.rowCount === 0) {
            throw new HttpError(400, 'There is no users with id ' + tid)
        }

        await pool.query('INSERT INTO followers(did, tid) VALUES ($1, $2)', [did, tid])
        res.send({ data: { did, tid } })

    } catch (e) {
        return handleError(e, res)
    }
})

app.listen(PORT, 'localhost', () => {
    console.log(`The twitter is running on http://localhost:${PORT}`)
})
