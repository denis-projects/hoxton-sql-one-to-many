import Database from "better-sqlite3";
import express from "express";
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

const db = new Database('./data.db', {
    verbose: console.log
})



//Get museums and works by museum id

const getWorksByMuseumId = db.prepare(`SELECT * FROM works WHERE museumId = ?;`)

const getAllMuseums = db.prepare(`SELECT * FROM museums`)

app.get(`/museums`, (req, res) => {
    const museums = getAllMuseums.all()

    for (const museum of museums) {
        const works = getWorksByMuseumId.all(museum.id)
        museum.works = works
    }
    res.send(museums)
})



//Get all works

const getAllWorks = db.prepare(`SELECT * FROM  works;`)

const getWorksById = db.prepare(`SELECT * FROM works WHERE id = ?`)

app.get(`/works`, (req, res) => {
    //get all works
    const works = getAllWorks.all()
    // for each work add museum
    for (const work of works) {
        const museum = getWorksById.get(work.museumId)
        work.museum = museum
    }

    res.send(works)
})



const getMuseumById = db.prepare(`
SELECT * FROM museums WHERE id = ?
`)



app.get(`/museums/:id`, (req, res) => {
    const id = req.params.id

    const museum = getMuseumById.get(id)
    res.send(museum)

    if (museum) {
        const works = getMuseumById.all(museum.id)
        museum.works = works
        res.send(museum)
    } else {
        res.status(404).send({ error: ' Museum not found' })
    }

})

app.get(`/works/:id`, (req, res) => {
    const id = req.params.id

    const work = getWorksById.get(id)

    if (work) {
        const museum = getWorksById.get(work.museumId)
        work.museum = museum
        res.send(work)

    } else {
        res.status(404).send({ error: ' Work not found' })
    }

})

app.listen(1234, () => console.log(`Listening on : http://localhost:1234`))






// //Create a new museum or work

// const createMuseum = db.prepare(`
// INSERT INTO museums (name, city) VALUES (?, ?);
// `)

// const createWork = db.prepare(`
// INSERT INTO works (name, picture, workId) VALUES (?, ?, ?);
// `)


// app.post(`/museums`, (req, res) => {
//     const { name, city } = req.body

//     const result = createMuseum.run(name, city)

//     if (result.changes !== 0) {
//         const museum = getMuseumById.get(result.lastInsertRowid)
//         res.send(museum)
//     } else {
//         res.status(404).send({ error: ' somethig went wrong' })
//     }

// })


// app.post(`/works`, (req, res) => {
//     const { name, picture, workId } = req.body

//     const result = createWork.run(name, picture, workId)

//     if (result.changes !== 0) {
//         const work = getWorksById.get(result.lastInsertRowid)
//         res.send(work)
//     } else {
//         res.status(404).send({ error: 'something went wrong' })
//     }
// })

