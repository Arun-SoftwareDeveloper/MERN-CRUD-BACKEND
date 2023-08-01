// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;

// Enable Cross-Origin Resource Sharing (CORS) for the React frontend
app.use(cors());

// Parse JSON body
app.use(express.json());

app.use(bodyParser.json());
// MongoDB connection URL (update this with your actual MongoDB connection string)
const mongoURL = "mongodb://0.0.0.0:27017/CRUD_Mern"; // Change 'mydatabase' to your desired database name

// Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectToMongoDB();
// Create a schema for the student model
const studentSchema = new mongoose.Schema({
  roll: { type: Number },
  name: { type: String, required: true },
  class: { type: String, required: true },
});

// Create a mongoose model using the schema
const Student = mongoose.model("Student", studentSchema);

// API route to get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Error fetching students" });
  }
});

// API route to add a new student
app.post("/addStudents", async (req, res) => {
  const newStudent = req.body;

  // Check if the required fields (roll, name, and class) are present in the request body
  // if (!newStudent.roll || !newStudent.name || !newStudent.class) {
  //   return res.status(400).json({ error: "Missing required fields" });
  // }

  try {
    const student = await Student.create(newStudent);
    return res.status(201).json(student);
  } catch (error) {
    console.error("Error creating student:", error);
    return res.status(500).json({ error: "Error creating student" });
  }
});

// API route to update an existing student
app.put("/students/:roll", async (req, res) => {
  const roll = parseInt(req.params.roll);
  const updatedFields = {
    name: req.body.name,
    class: req.body.class,
  };
  try {
    const student = await Student.findOneAndUpdate({ roll }, updatedFields, {
      new: true,
    });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Error updating student" });
  }
});

// API route to delete a student
app.delete("/students/:roll", async (req, res) => {
  const roll = parseInt(req.params.roll);
  try {
    await Student.findOneAndDelete({ roll });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Error deleting student" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
