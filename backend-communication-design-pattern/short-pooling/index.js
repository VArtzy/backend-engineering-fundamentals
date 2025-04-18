const app = require("express")()

const jobs = {}

app.post("/submit", (_, res) => {
    const jobId = `job:${Date.now()}`
    jobs[jobId] = 0
    updateJob(jobId, 0)
    res.end("\n\n" + jobId + "\n\n")
})

app.get("/checkstatus", (req, res) => {
    const jobStatus = jobs[req.query.jobId]
    console.log(jobStatus)
    res.end("\n\nJobStatus: " + jobStatus + "%\n\n")
})

app.listen(8080, () => console.log("listening on 8080"))

function updateJob(jobId, prg) {
    jobs[jobId] = prg
    console.log(`updated ${jobId} to ${prg}`)
    if (prg === 100) return
    setTimeout(() => updateJob(jobId, prg + 10), 3000)
}
