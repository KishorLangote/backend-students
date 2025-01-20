const express = require("express")
const cors = require("cors")
require("dotenv").config()
const app = express()



const { initializeDatabase } = require("./db/db.connection")
const Student = require("./models/students.model")


// middleware
app.use(cors({
    origin: "*",
    methods: ["POST", "GET", "PATCH", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
})) 
app.use(express.json()) 


initializeDatabase()  // call the database..

// const students = {
//     name: "John Doe", 
//     age: 35,
//     gender: "Male",
//     marks: 89,
//     attendance: 81,
//     grade: "B"
// }


// Routes

app.get("/", (req, res) => {
    res.send("Hello, express server!!")
})

// Route: get the all students

app.get("/students", async (req, res) => {
    try {
        const students = await Student.find()
        res.json(students)
    } catch (error) {
        res.status(500).json({error: "Internal server error"})
    }
} )

// Route: Add student data (feed data through postman)

app.post("/students", async (req, res) => {
    const { name, age, grade, marks, gender, attendance } = req.body

    if(!name || !age || !grade){
        return res.status(400).json({error: "Name, age and grade are required."})
    }
    try {
        const student = new Student({ name, age, grade, marks, gender, attendance })
        await student.save()
        res.status(201).json(student)
    } catch (error) {
        res.status(500).json({error: "Internal server error"})
    }
})

// modify the details an existig data by id through postman:

app.put("/students/:id", async (req, res) => {
    const studentId = req.params.id
    const updatedStudentData = req.body
    
    try {
        const updatedStudent = await Student.findByIdAndUpdate(studentId, updatedStudentData, { new: true },)

        if(!updatedStudent) {
            return res.status(404).json({message: "Student not found" })
        }

        res.status(200).json(updatedStudent)

    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal server error."})
    }
})

// delete route: delete student from database by id through postman:

app.delete("/students/:id", async (req, res) => {
    const studentId = req.params.id

    try {
        const deletedStudent = await Student.findByIdAndDelete(studentId);

        if(!deletedStudent) {
            res.status(404).json({message: "Student not found"})
        }

        res.status(200).json({message: "Student deleted successfully.", student: deletedStudent})

    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal server error"})
    }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`)
})
