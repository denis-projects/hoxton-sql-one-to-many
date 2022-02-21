import Database from "better-sqlite3";
import express from "express";
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

const db = new Database('./data.db', {
    verbose: console.log,

})