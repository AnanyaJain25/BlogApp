import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import Connection from './database/db.js';
import Router from './routes/route.js';

dotenv.config();

// initialising express as a function
const app = express();

app.use(cors());
app.use(bodyParser.json({extended:true}))
app.use(bodyParser.urlencoded({extended:true}))
app.use('/',Router);

if(process.env.NODE_ENV==='production'){
    //deploy frontend
    app.use(express.static("client/build"));
}
const PORT = process.env.PORT||8000;
//creating express server
//first argument is port number
//second is a call back function(helps in performing action just after running server)
app.listen(PORT, ()=> console.log(`server is running successfully on PORT ${PORT}`));

const USERNAME = process.env.DB_USERNAME; 
const PASSWORD = process.env.DB_PASSWORD; 

const URL = process.env.MONGODB_URI || `mongodb://${USERNAME}:${PASSWORD}@ac-pptppce-shard-00-00.0akaslu.mongodb.net:27017,ac-pptppce-shard-00-01.0akaslu.mongodb.net:27017,ac-pptppce-shard-00-02.0akaslu.mongodb.net:27017/?ssl=true&replicaSet=atlas-jg727e-shard-0&authSource=admin&retryWrites=true&w=majority`;

Connection(URL); 