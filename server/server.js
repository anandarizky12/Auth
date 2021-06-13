const express = require('express');
const authroutes = require('./routes/auth');
const errorHandler= require('./middleware/error');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');



require('dotenv').config({path: "./config.env"});
//connect to DB
connectDB();

const app = express();


app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/auth', authroutes)


//error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log(`server running on port ${PORT}`));