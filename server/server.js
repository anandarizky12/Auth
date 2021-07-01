const express = require('express');
const errorHandler= require('./middleware/error');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authroutes = require('./routes/auth');
const authroutesprivate = require('./routes/private');



require('dotenv').config({path: "./config.env"});
//connect to DB
connectDB();

const app = express();


app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/auth', authroutes)
app.use('/api/private', authroutesprivate)


//error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log(`server running on port ${PORT}`));