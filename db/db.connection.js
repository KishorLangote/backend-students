const mongoose = require("mongoose")
require("dotenv").config()

const mongoURI = process.env.MONGODB

// connect to database:

const initializeDatabase = () => {
    mongoose
    .connect(mongoURI)
    .then(() => {
        console.log("Database connected successfully.")
    })
    .catch((error) => {
        console.log("Error to connecting the database.", error)
    })
}

module.exports = { initializeDatabase }



