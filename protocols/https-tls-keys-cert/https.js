const https = require('https')
const fs = require('fs')

const options = {
    key: fs.readFileSync("private-key.pem"),
    cert: fs.readFileSync("certificate.pem")
}

const server = https.createServer(options, (_, res) => {
    res.writeHead(200, {'content-type': 'text/plain'})
    res.end("Hello HTTPS!\n")
})

server.listen(8443, () => {
    console.log(`HTTPS server is running on https://localhost:8443`)
})

// client
// curl -- curl https://localhost:8443 --insecure
// need to disable verification because our cert is not trusted
// OR add it to the cert store
