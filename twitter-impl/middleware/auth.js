import { pool } from "../index.js"

export default async function auth(req, res, next) {
    const token = req.get('X-API-TOKEN')

    if (token) {
        const user = await pool.query('SELECT id FROM users WHERE session_id = $1', [token])

        if (user.rowCount !== 0) {
            req.userId = user.rows[0].id
            req.token = token
            next()
            return
        }
    }

    res.status(401).send({ error: "Unauthorized" })
}
