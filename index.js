require("dotenv").config()
const express = require("express")
const connectToDb = require("./config/connect")
const router = require("./router")
const cors = require('cors')

const app = express()

connectToDb()

app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}))

app.use("/", router)

app.listen(5000, () => {
    console.log("port = 5000")
})