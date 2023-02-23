const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/route");
const multer =require("multer");

const app = express();
app.use(multer().any())

app.use(express.json());

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://Anuj123:hbgeAqZf9agKUOZ1@cluster0.fumqqxz.mongodb.net/xhipment-DB?retryWrites=true&w=majority",{
    useNewUrlParser :true
})
.then(()=>{ console.log("MongoDb is connected")})
.catch((err)=> console.log(err))

app.use("/", route);

app.listen(3000,function(){
    console.log("Express app running on port" +3000)
});
