const fs = require("fs")

console.log("1")

const res = fs.readFileSync("file.txt")

console.log("file:" + res)

console.log("2")
