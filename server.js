var dotenv = require('dotenv').config()

const express=require('express');
const app=express();
const expressLayouts=require('express-ejs-layouts');
const bodyParser =require('body-parser');



const indexRouter=require('./routes/index');
const authorRouter=require('./routes/authors');

app.set('view engine','ejs');
app.set('views',__dirname+"/views");

app.set('layout','layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
//connect mongoose
require('dotenv').config()
const mongoose = require('mongoose');
// const { config } = require('dotenv/types');
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true})
const db=mongoose.connection;
db.on('error',eror=>console.error(error));
db.once('open',()=>console.log('Connected Successfully'));

// mongoose.connect(`mongodb://${process.env.DB_NAME}:${process.env.DB_PASS}@ds241658.mlab.com:41658/test_db`,(err)=>{
// if(err) throw err;
// console.log("DB Connected Successfully");
// });



app.use('/',indexRouter);
app.use('/authors',authorRouter);

const PORT = 3000;
app.listen(PORT,()=>{
console.log(`Server Running on port ${PORT}`);
});