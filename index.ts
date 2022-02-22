import Database from "better-sqlite3";
import express from "express";
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

const db = new Database('./data.db', {
    verbose: console.log
})

//Get details of museums
//Get details of works


const createMuseum = db.prepare(`
INSERT INTO museums (name, city) VALUES (?, ?);
`)

const createWork = db.prepare(`
INSERT INTO works (name, picture, workId) VALUES (?, ?, ?);
`)

const getAllMuseums = db.prepare(`
SELECT * FROM museums;
`)

const getMuseumById = db.prepare(`
SELECT * FROM museums WHERE id = ?
`)

const getMuseumByWorkId = db.prepare(`
SELECT * FROM works WHERE workId = ?
`)


app.get(`/museums`, (req, res) => {
    const result = getAllMuseums.all()

    res.send(result)
})

app.get(`/museums/:id`, (req, res) => {
    const id = req.params.id

    const result = getMuseumById.get(id)

    if (result) {
        const museums = getMuseumByWorkId.all(result.id)
        result.id = museums
        res.send(result)
    } else {
        res.status(404).send({ error: ' Museum not found' })
    }

})



const getAllWorks = db.prepare(`
SELECT * FROM works;
`)

const getWorksById = db.prepare(`
SELECT * FROM works WHERE id = ?
`)

app.get(`/works`, (req, res) => {
    const result = getAllWorks.all()

    for (const work of result) {
        const museum = getMuseumById.get(work.WorkId)
        work.museum = museum
    }
    res.send(result)
})

app.get(`/works/:id`, (req, res) => {
    const id = req.params.id

    const result = getWorksById.get(id)

    res.send(result)
})

//Create a new museum

app.post(`/museums`, (req, res) => {
    const { name, city } = req.body

    const result = createMuseum.run(name, city)

    if (result.changes !== 0) {
        const museum = getMuseumById.get(result.lastInsertRowid)
        res.send(museum)
    } else {
        res.status(404).send({ error: ' somethig went wrong' })
    }

})


//Cerate a new work

app.post(`/works`, (req, res) => {
    const { name, picture, workId } = req.body

    const result = createWork.run(name, picture, workId)

    if (result.changes !== 0) {
        const work = getWorksById.get(result.lastInsertRowid)
        res.send(work)
    } else {
        res.status(404).send({ error: 'something went wrong' })
    }
})

app.listen(1234, () => console.log(`Listening on : http://localhost:1234`))