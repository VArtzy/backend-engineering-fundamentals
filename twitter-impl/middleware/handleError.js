import * as v from 'valibot'
import HttpError from "../error/HttpError.js"

export default function handleError(e, res) {
    console.error(e)

    if (e instanceof v.ValiError) {
        res.status(400).send({ error: e.message })
    } else if (e instanceof HttpError) {
        res.status(e.status).send({ error: e.message })
    } else {
        res.status(500).send({ error: 'Internal server error: ' + e.message })
    }
}
