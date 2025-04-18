const fs = require("fs")

console.log("1")

fs.readFile("file.txt", (_, data) => console.log("file:" + data.toString()))

console.log("2")
