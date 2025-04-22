const { Pool } = require("pg")
const express = require("express")

const app = express()
app.use(express.json())

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    host: process.env.DB_HOST || "vartz",
    port: process.env.DB_PORT || 5433,
    database: process.env.DB_NAME || "postgres"
})

app.get('/', (_, res) => res.sendFile(`${__dirname}/index.html`))
app.get('/client.js', (_, res) => res.sendFile(`${__dirname}/client.js`))

app.get('/grades/estimate', async (req, res) => {
    const result = await countGradesBetweenEstimate(req.query.from, req.query.to)

    res.setHeader("Content-Type", "application/json")
    res.send(JSON.stringify(result))
})

app.get('/grades', async (req, res) => {
    const result = await countGradesBetween(req.query.from, req.query.to)

    res.setHeader("Content-Type", "application/json")
    res.send(JSON.stringify(result))
})

async function countGradesBetweenEstimate(fromG, toG) {
    const result = await pool.query(
        "explain (format json) select count(*) from grades where g between $1 and $2",
        [fromG, toG]
    )
    const estimateRowCount = result.rows[0]["QUERY PLAN"][0]["Plan"]["Plans"][0]["Plan Rows"]
    console.log
    const obj = {
        rowCount: estimateRowCount,
        id: `g-${fromG}-${toG}`
    }
    return obj
}

async function countGradesBetween(fromG, toG) {
    const result = await pool.query(
        "select count(*) from grades where g between $1 and $2",
        [fromG, toG]
    )

    const rowCount = result.rows[0].count
    const obj = {
        rowCount: parseInt(rowCount),
        id: `g-${fromG}-${toG}`
    }
    return obj
}

app.listen(8080, () => console.log("Web server is listening on http://localhost:8080"))
connect()

async function connect() {
    try {
        await pool.connect()
        console.log("Connected successfully")
    } catch(e) {
        console.error(`Failed to connect ${e}`)
    }
}
