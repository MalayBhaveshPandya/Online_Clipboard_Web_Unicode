const mongoose=require("mongoose");


const connectToMongo=()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("Connected to MongoDB Successfully");
    })
    .catch(err=>{
        console.log(err);
    })
}

module.exports=connectToMongo;