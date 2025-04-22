const tblGrades = document.getElementById("tblGrades")
const btnLoadActual = document.getElementById("btnLoadActual")
const btnLoadEstimate = document.getElementById("btnLoadEstimate")
const lblDuration = document.getElementById("lblDuration")
let startTime = null
const grades = []

btnLoadActual.addEventListener('click', () => readCount(true))

btnLoadEstimate.addEventListener('click', () => readCount(false))

const tr1 = document.createElement('tr')
const tr2 = document.createElement('tr')
tblGrades.appendChild(tr1)
tblGrades.appendChild(tr2)

for (let i = 0; i < 10; i++) {
    grades.push({
        id: `g-${i*10}-${(i+1)*10}`,
        from: i*10,
        to: (i+1)*10
    })
}

for (let i = 0; i < 10; i++) {
    const h = grades[i]
    const hd = document.createElement('td')
    hd.id = h.id
    hd.textContent = h.id + " (...)"
    if (i < 5) {
        tr1.appendChild(hd)
    } else {
        tr2.appendChild(hd)
    }
}

function readCount(actual) {
    startTime = Date.now()
    lblDuration.textContent = 'Counting...'
    gradeCalls = []
    grades.forEach(g => gradeCalls.push(fetch(`http://localhost:8080/grades${actual ? '' : '/estimate'}?from=${g.from}&to=${g.to}`)))
    Promise.all(gradeCalls).then(a => {
        lblDuration.textContent = Date.now() - startTime + "ms"
        a.forEach((b, i) => b.json().then(c => {
            const h = grades[i]
            const hd = document.getElementById(h.id)
            hd.textContent = c.rowCount
        }))
    })
}
