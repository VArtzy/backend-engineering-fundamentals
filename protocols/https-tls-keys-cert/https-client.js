const http = require('https')
const req = http.request("https://example.com", {"method": "GET"})

req.on("response", res => {
    console.log(res.headers)
    console.log(res.statusCode)
    res.setEncoding('utf8')
    res.on("data", data => console.log(data))
})

req.end()
let x = req.getHeaders()
console.log(x)
