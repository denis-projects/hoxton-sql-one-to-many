import Database from 'better-sqlite3'

const db = new Database('./data.db', {
    verbose: console.log
})

const museums = [
    {
        name: 'Museum of Tirana',
        city: 'Tirana'
    },
    {
        name: 'Museum of Durrës',
        city: 'Durres'
    },
    {
        name: 'Museum of London',
        city: 'London'
    },
    {
        name: 'Museum of Manchester',
        city: 'Manchester'
    },
    {
        name: 'Museum of Liverpool',
        city: 'LiverPool'
    },
    {
        name: 'Museum of Prishtina',
        city: 'Prishtina'
    }
]

const works = [
    {
        name: 'Nature',
        picture: 'nature.jpg',
        workId: 1
    },
    {
        name: 'Garden',
        picture: 'Garden.jpg',
        workId: 2
    },
    {
        name: 'Paradise',
        picture: 'paradise.jps',
        workId: 3
    },
    {
        name: 'Trees',
        picture: 'trees.jpg',
        workId: 3
    },
    {
        name: 'Calming',
        picture: 'calming.jpg',
        workId: 4
    },
    {
        name: 'Fruits',
        picture: 'fruits.jpg',
        workId: 5
    }
]

const dropMuseums = db.prepare(`DROP TABLE IF EXISTS museums;`)
const dropWorks = db.prepare(`DROP TABLE IF EXISTS works;`)
dropMuseums.run()
dropWorks.run()

const createMuseums = db.prepare(`
CREATE TABLE museums (
  id     INTEGER,
  name   TEXT NOT NULL,
  city  TEXT NOT NULL,
  PRIMARY KEY(id)
);
`)

const createWorks = db.prepare(`
CREATE TABLE workss (
  id    	INTEGER,
  name  	TEXT NOT NULL,
  picture 	TEXT,
  workId INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY(workId) REFERENCES artists(id)
);`)

createMuseums.run()
createWorks.run()

const createMuseum = db.prepare(`
INSERT INTO museums (name, city) VALUES (?, ?);
`)

const createWork = db.prepare(`
INSERT INTO works (name, picture, workId) VALUES (?, ?, ?);
`)

for (const museum of museums) {
    createMuseum.run(museum.name, museum.city)
}

for (const work of works) {
    createWork.run(work.name, work.picture, work.workId)
}
