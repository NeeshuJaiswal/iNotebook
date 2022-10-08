const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotebook"

const connectToMongo =()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("connected to Mongo Successfully");
    })
}//mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false

module.exports = connectToMongo;