const mongoose = require("mongoose")

const URI = process.env.URI

const connectToDb = () => {
    try {
        mongoose.connect(URI)
            .then((res) => console.log("connected DB"))
            .catch((err) => console.log(err))
    }
    catch (err) {
        res.send(err.message)
    }
}

module.exports = connectToDb