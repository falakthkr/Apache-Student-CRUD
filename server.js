const express = require("express")
const mongoose = require("mongoose")
const students = require("./data")
const cors = require("cors")
const Student = require("./models/Student")
const paginatedResults = require("./Pagination/pagination")
const dotenv = require("dotenv");

dotenv.config();
const app = express()

app.use(cors())

mongoose.connect(
    process.env.ATLAS_URI,
    {
        useNewUrlParser: true, 
        useCreateIndex: true, 
        useUnifiedTopology: true 
    },
    () => {
      console.log("The database is connected");
    }
);

mongoose.connection
.once("open",async ()=>{
    console.log("MongoDB running")
    if((await Student.countDocuments().exec()) > 0){
        return;
    }
    Student.insertMany(students)
    .then((res)=>console.log("Users added successfully!"))
    .catch(err=>console.log(err))
})
.on("error",function(err){
    console.log(err)
})

app.get("/api/students",(req,res)=>{
    const page =  Number.parseInt(req.query.page)
    const limit = Number.parseInt(req.query.limit)
    
        const startIndex= (page-1) * limit
        const endIndex = page * limit
    
        const results = {}
    
        if(endIndex < students.length){
            results.next = {
                page : page + 1,
                limimt : limit
            }
        }
    
        if(startIndex > 0) {
            results.prev = {
                page : page - 1,
                limit : limit
            }
        }
    
        results.current = students.slice(startIndex,endIndex)
        res.json(results)
    })

    app.post("/api/students", (req, res) => {
        const { name, group, email, city, avatar, gender } = req.body;
        const newUser = new User({name, group, email, city, avatar, gender});
      
        newUser
          .save()
          .then(() => res.json("Student Added Successfully"))
          .catch((err) => res.status(400).json("Error: " + err));
    });

    // app.post('/api/students', (req, res) => {
    //     const newStudent = new Student({ 
    //         id : req.body.id, 
    //         name : req.body.name, 
    //         group : req.body.group, 
    //         email : req.body.email, 
    //         city : req.body.city, 
    //         avatar : req.body.avatar, 
    //         gender : req.body.gender
    //     });
    
    //     newStudent
    //         .save()
    //         .then(() => res.json('Student Added Successfully'))
    //         .catch((err) => res.status(400).json('Error: ' + err));
    // });
    
    app.delete('/api/student/:id', (req, res) => {
        Student.findByIdAndDelete(req.params.id)
            .then(() => res.json('Student Deleted Successfully'))
            .catch((err) => res.status(400).json('Error: ' + err));
    });
    
    app.post('/api/student/update/:id', (req, res) => {
        Student.findById(req.params.id)
            .then((student) => {
                student.name = req.body.name;
                student.group = req.body.group;
                student.email = req.body.email;
                student.city = req.body.city;
                student.avatar = req.body.avatar;
    
                student
                    .save()
                    .then(() => res.json('Student updated Successfully'))
                    .catch((err) => res.status(400).json('Error: ' + err));
            })
            .catch((err) => res.status(400).json('Error: ' + err));
    })

app.listen(5000,()=>{
    console.log("The server is up and running!")
})



// const express = require("express")
// const mongoose = require("mongoose")
// const students = require("./data")
// const Student = require("./models/Student")

// const app = express()

// mongoose.connect("mongodb://localhost/pagination",{
//     useNewUrlParser : true,
//     useCreateIndex : true,
//     useUnifiedTopology : true
// },(err)=>{
//     if(err){
//         console.log("Connection to database failed")
//     }
//     else{
//         console.log("Connection to database successfull!")
//     }
// })

// const db = mongoose.connection;
// db.once("open",async ()=>{
//     if((await Student.countDocuments().exec()) > 0){
//         return;
//     }
//     Student.insertMany(students)
//     .then(()=>res.json("Users added successfully!"))
//     .catch(err=>res.status(400).json("Error : "+err))
// })

// app.get("/api/students",(req,res)=>{
//     const page =  Number.parseInt(req.query.page)
//     const limit = Number.parseInt(req.query.limit)

//     const startIndex= (page-1) * limit
//     const endIndex = page * limit

//     const results = {}

//     if(endIndex < students.length){
//         results.next = {
//             page : page + 1,
//             limimt : limit
//         }
//     }

//     if(startIndex > 0) {
//         results.prev = {
//             page : page - 1,
//             limit : limit
//         }
//     }

//     results.current = students.slice(startIndex,endIndex)
//     res.json(results)
// })

// app.listen(5000,()=>{
//     console.log("The server is up and running!")
// })