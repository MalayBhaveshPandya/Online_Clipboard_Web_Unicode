const connectToMongo=require("./db");
const express=require("express");

const dotenv=require('dotenv').config();
const cors=require('cors');
connectToMongo();
const app=express();
const port=3000;

// Configure CORS properly for credentials
app.use(cors({
  origin: 'http://localhost:5173', // Specify the exact frontend origin
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'auth-token']
}));

app.use(express.json());

// Available Routes
app.use("/api/auth",require('./routes/auth'))
app.use("/api/clipboard",require('./routes/clipboard'))
// app.use("/api/notes",require('./routes/notes'))

app.listen(port,()=>{
    console.log(`Server is running on port ${port} 🚀`);
})
