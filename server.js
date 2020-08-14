var dotenv = require('dotenv').config()

const express=require('express');
const app=express();
const expressLayouts=require('express-ejs-layouts');

const indexRouter=require('./routes/index.js');

app.set('view engine','ejs');
app.set('views',__dirname+"/views");

app.set('layout','layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

//connect mongoose
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL,{useNewUrlParser:true})
const db=mongoose.connection;
db.on('error',eror=>console.error(error));
db.once('open',()=>console.log('Connected Successfully'));

// mongoose.connect(`mongodb://${process.env.DB_NAME}:${process.env.DB_PASS}@ds241658.mlab.com:41658/test_db`,(err)=>{
// if(err) throw err;
// console.log("DB Connected Successfully");
// });


const PORT = 3000;
app.listen(PORT,()=>{
console.log(`Server Running on port ${PORT}`);
});


app.use('/',indexRouter);