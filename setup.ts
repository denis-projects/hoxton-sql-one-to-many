import Database from "better-sqlite3";

const db = new Database('./data.db', {
    verbose: console.log
})

const museums = [
    {
        name: 'Museum of Tirana',
        city: 'Tirana'
    },
    {
        name: 'Museum of Durres',
        city: 'Durres'
    },
    {
        name: 'Museum of London',
        city: 'London'
    },
    {
        name: 'Museum of Liverpool',
        city: 'Liverpool'
    },
    {
        name: 'Museum of Manchester',
        city: 'Manchester'
    }
]

const works = [
    {
        name: 'Nature',
        picture: 'nature.jpg',
        museumId: 1
    },
    {
        name: 'Garden',
        picture: 'Garden.jpg',
        museumId: 2
    },
    {
        name: 'Paradise',
        picture: 'paradise.jps',
        museumId: 3
    },
    {
        name: 'Trees',
        picture: 'trees.jpg',
        museumId: 3
    },
    {
        name: 'Calming',
        picture: 'calming.jpg',
        museumId: 4
    },
    {
        name: 'Fruits',
        picture: 'fruits.jpg',
        museumId: 5
    }
]


const dropMuseums = db.prepare(`DROP TABLE IF EXISTS museums;`)
const dropWorks = db.prepare(`DROP TABLE IF EXISTS works;`)
dropMuseums.run()
dropWorks.run()

const createMuseums = db.prepare(`
CREATE TABLE IF NOT EXISTS museums (
id INTEGER,
name TEXT NOT NULL,
city TEXT NOT NULL,
PRIMARY KEY (id)
);
`)

const createWorks = db.prepare(`
CREATE TABLE IF NOT EXISTS works (
id INTEGER,
name TEXT NOT NULL,
picture TEXT NOT NULL,
museumId INTEGER ,
PRIMARY KEY (id),
FOREIGN KEY (museumId) REFERENCES museums(id)
);
`)

createMuseums.run()
createWorks.run()

const createMuseum = db.prepare(`
INSERT INTO museums (name, city) VALUES (?, ?)
`)

const createWork = db.prepare(`
INSERT INTO works (name, picture, museumID) VALUES (?, ?, ?)
`)

for (const museum of museums) {
    createMuseum.run(museum.name, museum.city)
}

for (const work of works) {
    createWork.run(work.name, work.picture, work.museumId)
}



